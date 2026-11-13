// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package favorite

import (
	"context"

	"asset/api/internal/svc"
	"asset/api/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type RemoveFavoritesLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewRemoveFavoritesLogic(ctx context.Context, svcCtx *svc.ServiceContext) *RemoveFavoritesLogic {
	return &RemoveFavoritesLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *RemoveFavoritesLogic) RemoveFavorites(req *types.UpdateFavoritesReq) error {
	// todo: add your logic here and delete this line

	return nil
}
