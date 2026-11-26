package storagelogic

import (
	"context"

	resourceclient "asset/rpc/client/resource"
	assetpb "asset/rpc/pb"
	authpb "auth/rpc/pb"
	"common/ctxdata"
	rabbitmq "common/rabbitmq"
	utils "common/utils/jsonstring"
	"storage/rpc/internal/enum"
	"storage/rpc/internal/svc"
	"storage/rpc/pb"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"

	"github.com/zeromicro/go-zero/core/logx"
)

type DownloadLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewDownloadLogic(ctx context.Context, svcCtx *svc.ServiceContext) *DownloadLogic {
	return &DownloadLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *DownloadLogic) Download(in *pb.DownloadReq) (*pb.DownloadResp, error) {
	resource, err := l.svcCtx.AssetRpc.GetResource(l.ctx, &resourceclient.GetResourceReq{Id: in.Id})
	if err != nil {
		return nil, err
	}

	userID := ctxdata.UserID(l.ctx)
	l.svcCtx.RabbitMQ.Publish(l.ctx, rabbitmq.PublishOptions{
		RoutingKey:  "count",
		Exchange:    "resource",
		ContentType: "application/protobuf",
		Headers:     amqp.Table{"UserID": userID},
		Message:     &assetpb.UpdateResourceDownloadCountReq{Id: in.Id},
	})

	l.svcCtx.RabbitMQ.Publish(l.ctx, rabbitmq.PublishOptions{
		RoutingKey:  "create",
		Exchange:    "log",
		ContentType: "application/protobuf",
		Message: &authpb.CreateLogReq{
			CreateTime: time.Now().UnixMilli(),
			OperatorId: ctxdata.UserInfo(l.ctx).Id,
			Desc:       utils.ToDescString(resource),
			Event:      enum.LogEventResourceDownload,
		},
	})

	return &pb.DownloadResp{
		ObjectName: resource.GetObjectName(),
		FullName:   resource.GetFullName(),
	}, nil
}
