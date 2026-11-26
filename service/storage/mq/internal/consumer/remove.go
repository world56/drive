package consumer

import (
	"context"
	"storage/mq/internal/svc"
	"storage/rpc/pb"

	rabbitmq "common/rabbitmq"

	"github.com/minio/minio-go/v7"
	amqp "github.com/rabbitmq/amqp091-go"
	"github.com/zeromicro/go-zero/core/logx"
	"google.golang.org/protobuf/proto"
)

type RemoveConsumer struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewRemoveConsumer(ctx context.Context, svcCtx *svc.ServiceContext) *RemoveConsumer {
	return &RemoveConsumer{
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (r *RemoveConsumer) Consume(ctx context.Context, d amqp.Delivery) error {
	var data pb.ObjectNames
	if err := proto.Unmarshal(d.Body, &data); err != nil {
		logx.Errorf("RemoveConsumer Unmarshal err: %v", err)
		return rabbitmq.ErrInvalidMessage
	}

	return r.RemoveObjectResources(ctx, data.GetIDs())
}

func (r *RemoveConsumer) RemoveObjectResources(c context.Context, objectNames []string) error {
	objLength := len(objectNames)

	if objLength == 0 {
		return nil
	}

	ch := make(chan minio.ObjectInfo, objLength)
	go func() {
		defer close(ch)
		for _, objectName := range objectNames {
			ch <- minio.ObjectInfo{Key: objectName}
		}
	}()

	for result := range r.svcCtx.Minio.Client.RemoveObjects(c, r.svcCtx.Config.MINIO_BUCKET, ch, minio.RemoveObjectsOptions{}) {
		if result.Err != nil && minio.ToErrorResponse(result.Err).Code != minio.NoSuchKey {
			return result.Err
		}
	}

	return nil
}
