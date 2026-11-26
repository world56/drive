package consumer

import (
	"asset/mq/internal/enum"
	"asset/mq/internal/model"
	"asset/mq/internal/svc"
	"context"

	"asset/rpc/pb"

	rabbitmq "common/rabbitmq"

	amqp "github.com/rabbitmq/amqp091-go"
	"github.com/zeromicro/go-zero/core/logx"
	"google.golang.org/protobuf/proto"
	"gorm.io/gorm"
)

type CountConsumer struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewCountConsumer(ctx context.Context, svcCtx *svc.ServiceContext) *CountConsumer {
	return &CountConsumer{
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (c *CountConsumer) Consume(ctx context.Context, d amqp.Delivery) error {
	var req pb.UpdateResourceDownloadCountReq
	if err := proto.Unmarshal(d.Body, &req); err != nil {
		logx.Errorf("UploadConsumer Unmarshal err: %v", err)
		return rabbitmq.ErrInvalidMessage
	}

	return c.UpdateCount(ctx, &req)
}

func (c *CountConsumer) UpdateCount(ctx context.Context, req *pb.UpdateResourceDownloadCountReq) error {
	return c.svcCtx.DB.Model(&model.Resource{}).
		Where("id = ? AND type <> ?", req.Id, enum.ResourceTypeFolder).
		Update("download_count", gorm.Expr("download_count + 1")).Error
}
