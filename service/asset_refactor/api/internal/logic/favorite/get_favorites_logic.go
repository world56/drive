// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package favorite

import (
	"context"

	"asset/api/internal/svc"
	"asset/api/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetFavoritesLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewGetFavoritesLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetFavoritesLogic {
	return &GetFavoritesLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetFavoritesLogic) GetFavorites(req *types.GetFavoritesReq) (resp *types.GetFavoritesResp, err error) {
	// todo: add your logic here and delete this line

	return
}
