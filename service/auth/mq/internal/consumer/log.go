package consumer

import (
	"auth/mq/internal/model"
	"auth/mq/internal/svc"
	"auth/rpc/pb"
	"context"
	"errors"

	rabbitmq "common/rabbitmq"

	amqp "github.com/rabbitmq/amqp091-go"
	"github.com/zeromicro/go-zero/core/logx"
	"google.golang.org/protobuf/proto"
	"time"
)

type LogConsumer struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewLogConsumer(ctx context.Context, svcCtx *svc.ServiceContext) *LogConsumer {
	return &LogConsumer{
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *LogConsumer) Consume(ctx context.Context, d amqp.Delivery) error {
	var req pb.CreateLogReq
	if err := proto.Unmarshal(d.Body, &req); err != nil {
		logx.Errorf("logConsumer Unmarshal err: %v", err)
		return rabbitmq.ErrInvalidMessage
	}

	return l.CreateLog(ctx, &req)
}

func (l *LogConsumer) CreateLog(ctx context.Context, req *pb.CreateLogReq) error {
	if req.CreateTime <= 0 {
		logx.Errorf("logConsumer missing create_time")
		return rabbitmq.ErrInvalidMessage
	}

	if err := l.svcCtx.DB.WithContext(ctx).Create(&model.Log{
		Desc:       req.Desc,
		Event:      req.Event,
		UserId:     req.OperatorId,
		CreateTime: time.UnixMilli(req.CreateTime),
	}).Error; err != nil {
		logx.Errorf("write log failed: %v", err)
		return errors.New("@-ERROR Log write failed")
	}
	return nil
}
