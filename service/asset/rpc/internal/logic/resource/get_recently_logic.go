package resourcelogic

import (
	"context"

	"asset/rpc/internal/enum"
	"asset/rpc/internal/model"
	"asset/rpc/internal/svc"
	"asset/rpc/pb"

	"google.golang.org/protobuf/types/known/emptypb"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetRecentlyLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewGetRecentlyLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetRecentlyLogic {
	return &GetRecentlyLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *GetRecentlyLogic) GetRecently(in *emptypb.Empty) (*pb.ResourcesResp, error) {
	var list []*pb.ResourceInfo

	if err := l.svcCtx.DB.WithContext(l.ctx).
		Model(&model.Resource{}).
		Select("id, full_name, type, parent_id").
		Where("remove = ?", enum.ResourceNormal).
		Limit(10).
		Order("create_time DESC").
		Find(&list).Error; err != nil {
		return nil, err
	}

	return &pb.ResourcesResp{List: list}, nil
}
