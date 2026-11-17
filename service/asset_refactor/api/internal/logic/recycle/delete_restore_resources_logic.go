// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package recycle

import (
	"context"

	"asset/api/internal/svc"
	"asset/api/internal/types"
	"asset/rpc/pb"

	"github.com/zeromicro/go-zero/core/logx"
)

type DeleteRestoreResourcesLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewDeleteRestoreResourcesLogic(ctx context.Context, svcCtx *svc.ServiceContext) *DeleteRestoreResourcesLogic {
	return &DeleteRestoreResourcesLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *DeleteRestoreResourcesLogic) DeleteRestoreResources(req *types.UpdateRecyclesReq) error {
	_, err := l.svcCtx.RecycleRpc.DeleteRestoreResources(l.ctx, &pb.UpdateRecyclesReq{
		Ids: req.Ids,
	})
	return err
}
