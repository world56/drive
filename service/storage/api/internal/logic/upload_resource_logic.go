// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package logic

import (
	"context"
	"mime"
	"mime/multipart"
	"path/filepath"
	"strconv"

	assetpb "asset/rpc/pb"
	"common/ctxdata"
	"common/idgen"
	rabbitmq "common/rabbitmq"
	"storage/api/internal/svc"
	"storage/api/internal/types"

	"github.com/minio/minio-go/v7"
	amqp "github.com/rabbitmq/amqp091-go"
	"github.com/zeromicro/go-zero/core/logx"
)

type writeCache struct {
	ID         string `redis:"ID"`
	Name       string `redis:"Name"`
	Index      int    `redis:"Index"`
	Total      int    `redis:"Total"`
	Size       int64  `redis:"Size"`
	Path       string `redis:"Path"`
	ParentID   *int64 `redis:"ParentID"`
	UploadID   string `redis:"MinioID"`
	ObjectName string `redis:"ObjectName"`
}

type UploadResourceLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewUploadResourceLogic(ctx context.Context, svcCtx *svc.ServiceContext) *UploadResourceLogic {
	return &UploadResourceLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *UploadResourceLogic) getObjectName(name string) string {
	return strconv.FormatInt(idgen.SnowflakeIDNext(), 10) + filepath.Ext(name)
}

func (l *UploadResourceLogic) detectContentType(filename string) string {
	contentType := mime.TypeByExtension(filepath.Ext(filename))
	if contentType == "" {
		contentType = "application/octet-stream"
	}
	return contentType
}

func (l *UploadResourceLogic) clearFirstChunk(isFirst bool, info writeCache) {
	if isFirst {
		l.svcCtx.Minio.AbortMultipartUpload(l.ctx, l.svcCtx.Config.MINIO_BUCKET, info.ObjectName, info.UploadID)
		l.svcCtx.Redis.Del(l.ctx, `drive:write:`+info.ID)
	}
}

func (l *UploadResourceLogic) publishUpload(userID string, info writeCache) {
	l.svcCtx.RabbitMQ.Publish(l.ctx, rabbitmq.PublishOptions{
		RoutingKey:  "upload",
		Exchange:    "resource",
		ContentType: "application/protobuf",
		Headers:     amqp.Table{"UserID": userID},
		Message: &assetpb.CreateResourceReq{
			FullName:   info.Name,
			Size:       info.Size,
			Path:       info.Path,
			ParentId:   info.ParentID,
			ObjectName: info.ObjectName,
			CreatorId:  userID,
		},
	})
}

func (l *UploadResourceLogic) UploadResource(req *types.UploadResourceReq, stream multipart.File, size int64) (resp *types.UploadResourceResp, err error) {
	userID := ctxdata.UserID(l.ctx)
	BUCKET := l.svcCtx.Config.MINIO_BUCKET
	info := writeCache{
		ID:       req.Id,
		Name:     req.Name,
		Index:    req.Index,
		Total:    req.Total,
		Size:     req.Size,
		Path:     req.Path,
		ParentID: req.ParentId,
	}

	// 单个文件直接上传
	if info.Total == 1 {
		info.ObjectName = l.getObjectName(info.Name)
		if _, err := l.svcCtx.Minio.Client.PutObject(l.ctx, BUCKET, info.ObjectName, stream, size, minio.PutObjectOptions{
			ContentType: l.detectContentType(info.Name),
		}); err != nil {
			return nil, err
		}
		l.publishUpload(userID, info)
		return &types.UploadResourceResp{ObjectName: info.ObjectName}, nil
	}

	IS_FIRST_CHUNK := info.Index == 1        // 第一个chunk
	IS_COMPLETED := info.Index == info.Total // 最后一个chunk

	// 初始化、拿到 minio ID
	if IS_FIRST_CHUNK {
		info.ObjectName = l.getObjectName(info.Name)
		ID, err := l.svcCtx.Minio.NewMultipartUpload(l.ctx, BUCKET, info.ObjectName, minio.PutObjectOptions{
			ContentType: l.detectContentType(info.Name),
		})
		if err != nil {
			return nil, err
		}
		info.UploadID = ID
	} else {
		var cache writeCache
		err := l.svcCtx.Redis.HGetAll(l.ctx, `drive:write:`+info.ID).Scan(&cache)
		if err != nil {
			return nil, err
		}
		info.Name = cache.Name
		info.UploadID = cache.UploadID
		info.ObjectName = cache.ObjectName
	}

	// 分段写入
	_, err = l.svcCtx.Minio.PutObjectPart(l.ctx, BUCKET, info.ObjectName, info.UploadID, info.Index, stream, size, minio.PutObjectPartOptions{})
	if err != nil {
		l.clearFirstChunk(IS_FIRST_CHUNK, info)
		return nil, err
	}

	_, rErr := l.svcCtx.Redis.HSet(l.ctx, `drive:write:`+info.ID, info).Result()
	if rErr != nil {
		l.clearFirstChunk(IS_FIRST_CHUNK, info)
		return nil, rErr
	}

	// 全部完成
	if IS_COMPLETED {
		parts, err := l.svcCtx.Minio.ListObjectParts(l.ctx, BUCKET, info.ObjectName, info.UploadID, 0, info.Total)
		if err != nil {
			return nil, err
		}

		var mergeParts []minio.CompletePart
		for _, v := range parts.ObjectParts {
			mergeParts = append(mergeParts, minio.CompletePart{PartNumber: v.PartNumber, ETag: v.ETag})
		}

		_, err = l.svcCtx.Minio.CompleteMultipartUpload(l.ctx, BUCKET, info.ObjectName, info.UploadID, mergeParts, minio.PutObjectOptions{})
		if err != nil {
			return nil, err
		}
		l.svcCtx.Redis.Del(l.ctx, `drive:write:`+info.ID)
		l.publishUpload(userID, info)
		return &types.UploadResourceResp{ObjectName: info.ObjectName}, nil
	}

	return &types.UploadResourceResp{ObjectName: ""}, nil
}
