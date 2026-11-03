package mqconsumer

import (
	authpb "api/auth"
	"auth/internal/dto"
	"auth/internal/service"
	rabbitmq "common/rabbitmq"
	"context"

	amqp "github.com/rabbitmq/amqp091-go"
	"google.golang.org/protobuf/proto"
)

type LogConsumer struct {
	mq         *rabbitmq.Client
	logService *service.LogService
}

func newLogConsumer(client *rabbitmq.Client, svc *service.LogService) *LogConsumer {
	return &LogConsumer{
		mq:         client,
		logService: svc,
	}
}

func (l *LogConsumer) Run() error {
	return l.mq.Serve("write", "auth-log-write", l.onWriteLog)
}

func (l *LogConsumer) onWriteLog(c context.Context, d amqp.Delivery) error {
	var msg authpb.Log
	if err := proto.Unmarshal(d.Body, &msg); err != nil {
		return rabbitmq.ErrInvalidMessage
	}

	return l.logService.WriteLog(c, &dto.WriteLog{
		Event:  msg.GetEvent(),
		Desc:   msg.GetDesc(),
		UserID: msg.GetOperatorId(),
	})
}
