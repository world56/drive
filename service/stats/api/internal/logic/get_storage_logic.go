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

type GetStorageLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewGetStorageLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetStorageLogic {
	return &GetStorageLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetStorageLogic) GetStorage() (resp *types.StorageUsageResp, err error) {
	data, err := l.svcCtx.StatsRpc.GetStorage(l.ctx, &emptypb.Empty{})
	if err != nil {
		return nil, err
	}

	return &types.StorageUsageResp{
		Free:    data.Free,
		Total:   data.Total,
		Used:    data.Used,
		Storage: data.Storage,
	}, nil
}
