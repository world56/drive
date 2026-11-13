// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package recycle

import (
	"context"

	"asset/api/internal/svc"
	"asset/api/internal/types"

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
	// todo: add your logic here and delete this line

	return nil
}
