// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package logic

import (
	"context"
	"net/http"

	"storage/api/internal/pkg/stream"
	"storage/api/internal/svc"
	"storage/api/internal/types"
	storageclient "storage/rpc/client/storage"

	"github.com/zeromicro/go-zero/core/logx"
)

type DownloadObjectResourceReqLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewDownloadObjectResourceReqLogic(ctx context.Context, svcCtx *svc.ServiceContext) *DownloadObjectResourceReqLogic {
	return &DownloadObjectResourceReqLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

// DownloadObjectResourceReq 下载（对齐 gin Download：先查资源再 attachment 流）
func (l *DownloadObjectResourceReqLogic) DownloadObjectResourceReq(w http.ResponseWriter, r *http.Request, req *types.DownloadObjectResourceReq) error {
	resource, err := l.svcCtx.StorageRpc.Download(l.ctx, &storageclient.DownloadReq{Id: req.Id})
	if err != nil {
		return err
	}

	return stream.ServeObject(
		l.ctx, l.svcCtx.Minio, l.svcCtx.Config.MINIO_BUCKET,
		w, r, resource.GetObjectName(), resource.GetFullName(), "attachment",
	)
}
