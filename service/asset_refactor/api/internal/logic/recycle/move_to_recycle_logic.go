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

type MoveToRecycleLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewMoveToRecycleLogic(ctx context.Context, svcCtx *svc.ServiceContext) *MoveToRecycleLogic {
	return &MoveToRecycleLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *MoveToRecycleLogic) MoveToRecycle(req *types.UpdateRecyclesReq) error {
	_, err := l.svcCtx.RecycleRpc.MoveToRecycle(l.ctx, &pb.UpdateRecyclesReq{Ids: req.Ids})
	return err
}
