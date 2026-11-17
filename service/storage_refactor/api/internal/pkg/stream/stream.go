package stream

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"strconv"

	"storage/api/internal/pkg/utils"

	"github.com/minio/minio-go/v7"
)

func statObject(ctx context.Context, core *minio.Core, bucket, objectName string) (size int64, contentType string, err error) {
	info, err := core.Client.StatObject(ctx, bucket, objectName, minio.StatObjectOptions{})
	if err != nil {
		return 0, "", err
	}
	ct := info.ContentType
	if ct == "" {
		ct = "application/octet-stream"
	}
	return info.Size, ct, nil
}

func openObject(ctx context.Context, core *minio.Core, bucket, objectName string, start, end int64) (io.ReadCloser, error) {
	opts := minio.GetObjectOptions{}
	if start >= 0 && end >= start {
		if err := opts.SetRange(start, end); err != nil {
			return nil, err
		}
	}
	body, _, _, err := core.GetObject(ctx, bucket, objectName, opts)
	return body, err
}

func ServeObject(ctx context.Context, core *minio.Core, bucket string, w http.ResponseWriter, r *http.Request, objectName, filename, disposition string) error {
	size, contentType, err := statObject(ctx, core, bucket, objectName)
	if err != nil {
		return err
	}

	start, end, partial, ok := utils.ParseByteRange(r.Header.Get("Range"), size)
	if !ok {
		w.Header().Set("Content-Range", fmt.Sprintf("bytes */%d", size))
		w.WriteHeader(http.StatusRequestedRangeNotSatisfiable)
		return nil
	}

	rs, re := int64(-1), int64(-1)
	if partial {
		rs, re = start, end
	}
	body, err := openObject(ctx, core, bucket, objectName, rs, re)
	if err != nil {
		return err
	}
	defer body.Close()

	length := int64(0)
	if size > 0 {
		length = end - start + 1
	}

	w.Header().Set("Accept-Ranges", "bytes")
	w.Header().Set("Content-Type", contentType)
	w.Header().Set("Content-Disposition", disposition+`; filename="`+filename+`"`)
	w.Header().Set("Content-Length", strconv.FormatInt(length, 10))
	if disposition == "inline" {
		w.Header().Set("Cache-Control", "public, max-age=31536000")
	}

	status := http.StatusOK
	if partial {
		status = http.StatusPartialContent
		w.Header().Set("Content-Range", fmt.Sprintf("bytes %d-%d/%d", start, end, size))
	}
	w.WriteHeader(status)
	_, _ = io.Copy(w, body)
	return nil
}
