// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package favorite

import (
	"context"

	"asset/api/internal/svc"
	"asset/api/internal/types"
	"asset/rpc/pb"

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
	_, err := l.svcCtx.FavoriteRpc.InsertFavorites(l.ctx, &pb.UpdateFavoritesReq{
		Ids: req.Ids,
	})
	if err != nil {
		return err
	}

	return nil
}
