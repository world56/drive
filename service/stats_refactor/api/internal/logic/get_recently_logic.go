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

type GetRecentlyLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewGetRecentlyLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetRecentlyLogic {
	return &GetRecentlyLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetRecentlyLogic) GetRecently() (resp *types.ResourceResp, err error) {
	data, err := l.svcCtx.StatsRpc.GetRecently(l.ctx, &emptypb.Empty{})
	if err != nil {
		return nil, err
	}

	list := make([]types.ResourceItem, 0, len(data.List))
	for _, val := range data.List {
		list = append(list, types.ResourceItem{
			ID:       val.Id,
			FullName: val.FullName,
			ParentID: val.ParentId,
			Type:     val.Type,
		})
	}
	return &types.ResourceResp{List: list}, nil
}
