// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package logic

import (
	"context"

	"stats/api/internal/svc"
	"stats/api/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetHotLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewGetHotLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetHotLogic {
	return &GetHotLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetHotLogic) GetHot() (resp *types.HotResp, err error) {
	// todo: add your logic here and delete this line

	return
}
