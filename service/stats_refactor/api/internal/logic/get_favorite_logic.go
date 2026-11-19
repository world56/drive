// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package logic

import (
	"context"

	"stats/api/internal/svc"
	"stats/api/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetFavoriteLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewGetFavoriteLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetFavoriteLogic {
	return &GetFavoriteLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetFavoriteLogic) GetFavorite() (resp *types.FavoriteResp, err error) {
	// todo: add your logic here and delete this line

	return
}
