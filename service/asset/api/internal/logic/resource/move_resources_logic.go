// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package resource

import (
	"context"

	"asset/api/internal/svc"
	"asset/api/internal/types"
	"asset/rpc/pb"

	"github.com/zeromicro/go-zero/core/logx"
)

type MoveResourcesLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewMoveResourcesLogic(ctx context.Context, svcCtx *svc.ServiceContext) *MoveResourcesLogic {
	return &MoveResourcesLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *MoveResourcesLogic) MoveResources(req *types.MoveResourcesReq) error {
	_, err := l.svcCtx.ResourceRpc.MoveResources(l.ctx, &pb.MoveResourcesReq{
		Ids:      req.Ids,
		ParentId: req.ParentId,
	})

	return err
}
