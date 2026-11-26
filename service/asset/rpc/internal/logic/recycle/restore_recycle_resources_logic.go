package recyclelogic

import (
	authpb "auth/rpc/pb"
	rabbitmq "common/rabbitmq"
	utils "common/utils/jsonstring"
	"context"
	"time"

	"asset/rpc/internal/enum"
	resourcelogic "asset/rpc/internal/logic/resource"
	"asset/rpc/internal/model"
	"asset/rpc/internal/svc"
	"asset/rpc/pb"
	"common/ctxdata"
	"errors"

	"google.golang.org/protobuf/types/known/emptypb"
	"gorm.io/gorm"

	"github.com/zeromicro/go-zero/core/logx"
)

type RestoreRecycleResourcesLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewRestoreRecycleResourcesLogic(ctx context.Context, svcCtx *svc.ServiceContext) *RestoreRecycleResourcesLogic {
	return &RestoreRecycleResourcesLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *RestoreRecycleResourcesLogic) RestoreRecycleResources(in *pb.UpdateRecyclesReq) (*emptypb.Empty, error) {
	var affected []model.Resource
	user := ctxdata.UserInfo(l.ctx)
	if user.Id == 0 {
		return nil, errors.New("invalid user id")
	}

	if err := l.svcCtx.DB.WithContext(l.ctx).Transaction(func(t *gorm.DB) error {
		if err := t.Where("resource_id IN ?", in.Ids).Delete(&model.Recycle{}).Error; err != nil {
			return err
		}
		var err error
		resourceUpdate := resourcelogic.NewUpdateResourceLogic(l.ctx, l.svcCtx)
		affected, err = resourceUpdate.UpdateResourceStatus(l.ctx, t, in.Ids, enum.ResourceNormal)
		return err
	}); err != nil {
		return nil, err
	}

	l.svcCtx.RabbitMQ.Publish(l.ctx, rabbitmq.PublishOptions{
		RoutingKey:  "create",
		Exchange:    "log",
		ContentType: "application/protobuf",
		Message: &authpb.CreateLogReq{
			OperatorId: user.Id,
			CreateTime: time.Now().UnixMilli(),
			Desc:       utils.ToDescString(affected),
			Event:      enum.LogEventRecycleBinRecovery,
		},
	})
	return &emptypb.Empty{}, nil
}
