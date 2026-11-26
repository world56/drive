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

type RestoreRecycleResourcesLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewRestoreRecycleResourcesLogic(ctx context.Context, svcCtx *svc.ServiceContext) *RestoreRecycleResourcesLogic {
	return &RestoreRecycleResourcesLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *RestoreRecycleResourcesLogic) RestoreRecycleResources(req *types.UpdateRecyclesReq) error {
	_, err := l.svcCtx.RecycleRpc.RestoreRecycleResources(l.ctx, &pb.UpdateRecyclesReq{
		Ids: req.Ids,
	})
	return err
}
