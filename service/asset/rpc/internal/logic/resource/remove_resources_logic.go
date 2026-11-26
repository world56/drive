package resourcelogic

import (
	"context"

	"asset/rpc/internal/model"
	"asset/rpc/internal/svc"
	"asset/rpc/pb"

	"google.golang.org/protobuf/types/known/emptypb"
	"gorm.io/gorm"

	"github.com/zeromicro/go-zero/core/logx"
)

type RemoveResourcesLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewRemoveResourcesLogic(ctx context.Context, svcCtx *svc.ServiceContext) *RemoveResourcesLogic {
	return &RemoveResourcesLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *RemoveResourcesLogic) RemoveResources(in *pb.RemoveResourcesReq) (*emptypb.Empty, error) {
	if err := l.RemoveByIds(l.svcCtx.DB.WithContext(l.ctx), in.Ids); err != nil {
		return nil, err
	}

	return &emptypb.Empty{}, nil
}

func (l *RemoveResourcesLogic) RemoveByIds(db *gorm.DB, ids []int64) error {
	if len(ids) == 0 {
		return nil
	}

	return db.Where("id IN ?", ids).Delete(&model.Resource{}).Error
}
