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

type GetAccessTrendsLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewGetAccessTrendsLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetAccessTrendsLogic {
	return &GetAccessTrendsLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetAccessTrendsLogic) GetAccessTrends() (resp *types.AccessResp, err error) {
	data, err := l.svcCtx.StatsRpc.GetAccessTrends(l.ctx, &emptypb.Empty{})
	if err != nil {
		return nil, err
	}

	list := make([]types.AccessItem, 0, len(data.List))
	for _, val := range data.List {
		list = append(list, types.AccessItem{
			Date:  val.Date,
			Value: val.Value,
		})
	}
	return &types.AccessResp{List: list}, nil
}
