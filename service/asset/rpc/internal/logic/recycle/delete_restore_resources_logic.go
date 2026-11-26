package recyclelogic

import (
	mq "common/rabbitmq"
	utils "common/utils/jsonstring"
	"context"

	"asset/rpc/internal/enum"
	favoritelogic "asset/rpc/internal/logic/favorite"
	resourcelogic "asset/rpc/internal/logic/resource"
	"asset/rpc/internal/model"
	"asset/rpc/internal/svc"
	"asset/rpc/pb"
	authpb "auth/rpc/pb"
	"common/ctxdata"
	storagepb "storage/rpc/pb"

	"time"

	"google.golang.org/protobuf/types/known/emptypb"
	"gorm.io/gorm"

	amqp "github.com/rabbitmq/amqp091-go"
	"github.com/zeromicro/go-zero/core/logx"
)

type DeleteRestoreResourcesLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewDeleteRestoreResourcesLogic(ctx context.Context, svcCtx *svc.ServiceContext) *DeleteRestoreResourcesLogic {
	return &DeleteRestoreResourcesLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *DeleteRestoreResourcesLogic) DeleteRestoreResources(in *pb.UpdateRecyclesReq) (*emptypb.Empty, error) {
	var objectNames []string
	var removed []model.Resource
	user := ctxdata.UserInfo(l.ctx)
	userId := ctxdata.UserID(l.ctx)

	if err := l.svcCtx.DB.WithContext(l.ctx).Transaction(func(t *gorm.DB) error {
		if err := t.Raw(`
			WITH RECURSIVE tree AS (
				SELECT id, object_name, parent_id, type, size, full_name, creator_id, suffix
				FROM resources WHERE id IN ?
				UNION ALL
				SELECT r.id, r.object_name, r.parent_id, r.type, r.size, r.full_name, r.creator_id, r.suffix
				FROM resources AS r
				INNER JOIN tree AS p ON r.parent_id = p.id AND p.type = ?
			)
			SELECT id, type, size, full_name, parent_id, creator_id, object_name, suffix FROM tree
		`, in.Ids, enum.ResourceTypeFolder).Scan(&removed).Error; err != nil {
			return err
		}

		Ids := make([]int64, 0, len(removed))
		for _, resource := range removed {
			Ids = append(Ids, resource.Id)
			if resource.ObjectName != "" && resource.Type != enum.ResourceTypeFolder {
				objectNames = append(objectNames, resource.ObjectName)
			}
		}

		if err := resourcelogic.NewRemoveResourcesLogic(l.ctx, l.svcCtx).RemoveByIds(t, Ids); err != nil {
			return err
		}
		if err := t.Where("resource_id IN ?", Ids).Delete(&model.Recycle{}).Error; err != nil {
			return err
		}
		if err := favoritelogic.NewRemoveFavoritesLogic(l.ctx, l.svcCtx).RemoveByIds(t, Ids); err != nil {
			return err
		}
		return nil
	}); err != nil {
		return nil, err
	}

	l.svcCtx.RabbitMQ.Publish(l.ctx, mq.PublishOptions{
		RoutingKey:  "create",
		Exchange:    "log",
		ContentType: "application/protobuf",
		Message: &authpb.CreateLogReq{
			OperatorId: user.Id,
			CreateTime: time.Now().UnixMilli(),
			Desc:       utils.ToDescString(removed),
			Event:      enum.LogEventRecycleBinDelete,
		},
	})

	if len(objectNames) == 0 {
		return &emptypb.Empty{}, nil
	}

	l.svcCtx.RabbitMQ.Publish(l.ctx, mq.PublishOptions{
		RoutingKey:  "remove",
		Exchange:    "resource",
		ContentType: "application/protobuf",
		Headers:     amqp.Table{"UserID": userId},
		Message:     &storagepb.ObjectNames{IDs: objectNames},
	})

	return &emptypb.Empty{}, nil
}
