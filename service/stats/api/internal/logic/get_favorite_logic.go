// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package logic

import (
	"context"

	"stats/api/internal/svc"
	"stats/api/internal/types"

	"google.golang.org/protobuf/types/known/emptypb"

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
	data, err := l.svcCtx.StatsRpc.GetFavorite(l.ctx, &emptypb.Empty{})
	if err != nil {
		return nil, err
	}

	list := make([]types.FavoriteItem, 0, len(data.List))
	for _, val := range data.List {
		list = append(list, types.FavoriteItem{
			ID:       val.Id,
			FullName: val.FullName,
			ParentID: val.ParentId,
			Type:     val.Type,
			Count:    val.Count,
		})
	}
	return &types.FavoriteResp{List: list}, nil
}
