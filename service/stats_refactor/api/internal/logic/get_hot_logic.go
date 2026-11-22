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
	data, err := l.svcCtx.StatsRpc.GetHot(l.ctx, &emptypb.Empty{})
	if err != nil {
		return nil, err
	}

	list := make([]types.HotItem, 0, len(data.List))
	for _, val := range data.List {
		list = append(list, types.HotItem{
			Name:  val.Name,
			Value: val.Value,
		})
	}
	return &types.HotResp{List: list}, nil
}
