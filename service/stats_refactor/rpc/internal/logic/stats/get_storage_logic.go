package statslogic

import (
	"context"

	"stats/rpc/internal/svc"
	"stats/rpc/pb"

	"google.golang.org/protobuf/types/known/emptypb"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetStorageLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewGetStorageLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetStorageLogic {
	return &GetStorageLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *GetStorageLogic) GetStorage(_ *emptypb.Empty) (*pb.GetStorageResp, error) {
	// TODO: 接 StorageRpc.GetSpaceUsage + Redis/Asset 类型计数
	return &pb.GetStorageResp{}, nil
}
