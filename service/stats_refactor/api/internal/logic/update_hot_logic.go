// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package logic

import (
	"context"

	"stats/api/internal/svc"
	"stats/api/internal/types"
	"stats/rpc/pb"

	"github.com/zeromicro/go-zero/core/logx"
)

type UpdateHotLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewUpdateHotLogic(ctx context.Context, svcCtx *svc.ServiceContext) *UpdateHotLogic {
	return &UpdateHotLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *UpdateHotLogic) UpdateHot(req *types.HotUpdateReq) error {
	_, err := l.svcCtx.StatsRpc.UpdateHot(l.ctx, &pb.UpdateHotReq{Name: req.Name})
	return err
}
