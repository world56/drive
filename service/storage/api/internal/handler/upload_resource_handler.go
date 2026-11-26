// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package handler

import (
	"errors"
	"net/http"

	"storage/api/internal/logic"
	"storage/api/internal/svc"
	"storage/api/internal/types"

	"github.com/zeromicro/go-zero/rest/httpx"
)

const maxChunkSize = 5 << 20 // 5 MB

func UploadResourceHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.UploadResourceReq
		if err := httpx.Parse(r, &req); err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
			return
		}

		chunk, header, err := r.FormFile("chunk")
		if err != nil {
			httpx.Error(w, err)
			return
		}
		defer chunk.Close()

		size := header.Size
		if size <= 0 {
			httpx.Error(w, errors.New("resource must not be empty."))
			return
		}

		if size > maxChunkSize {
			httpx.Error(w, errors.New("Resource must not exceed 5MB."))
			return
		}

		l := logic.NewUploadResourceLogic(r.Context(), svcCtx)
		resp, err := l.UploadResource(&req, chunk, size)
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.OkJsonCtx(r.Context(), w, resp)
		}
	}
}
