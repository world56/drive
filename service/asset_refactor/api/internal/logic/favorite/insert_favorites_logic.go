// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package favorite

import (
	"context"

	"asset/api/internal/svc"
	"asset/api/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type InsertFavoritesLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewInsertFavoritesLogic(ctx context.Context, svcCtx *svc.ServiceContext) *InsertFavoritesLogic {
	return &InsertFavoritesLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *InsertFavoritesLogic) InsertFavorites(req *types.UpdateFavoritesReq) error {
	// todo: add your logic here and delete this line

	return nil
}
