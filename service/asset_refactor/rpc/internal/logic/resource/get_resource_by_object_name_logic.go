package resourcelogic

import (
	"context"
	"errors"

	"asset/rpc/internal/enum"
	"asset/rpc/internal/model"
	"asset/rpc/internal/svc"
	"asset/rpc/pb"

	"github.com/zeromicro/go-zero/core/logx"
	"gorm.io/gorm"
)

type GetResourceByObjectNameLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewGetResourceByObjectNameLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetResourceByObjectNameLogic {
	return &GetResourceByObjectNameLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *GetResourceByObjectNameLogic) GetResourceByObjectName(in *pb.GetResourceByObjectNameReq) (*pb.ResourceInfo, error) {
	var row model.Resource
	err := l.svcCtx.DB.WithContext(l.ctx).
		Model(&model.Resource{}).
		Select("id", "parent_id").
		Where("object_name = ? AND remove = ?", in.ObjectName, enum.ResourceNormal).
		Take(&row).Error
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	return &pb.ResourceInfo{Id: row.Id, ParentId: row.ParentId}, nil
}
