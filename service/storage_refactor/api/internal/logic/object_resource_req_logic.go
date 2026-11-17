// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package logic

import (
	"context"
	"net/http"

	"storage/api/internal/pkg/stream"
	"storage/api/internal/svc"
	"storage/api/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type ObjectResourceReqLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewObjectResourceReqLogic(ctx context.Context, svcCtx *svc.ServiceContext) *ObjectResourceReqLogic {
	return &ObjectResourceReqLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *ObjectResourceReqLogic) ObjectResourceReq(w http.ResponseWriter, r *http.Request, req *types.ObjectResourceReq) error {
	return stream.ServeObject(
		l.ctx, l.svcCtx.Minio, l.svcCtx.Config.MINIO_BUCKET,
		w, r, req.ObjectName, req.ObjectName, "inline",
	)
}
