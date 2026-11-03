package mqconsumer

import (
	"auth/internal/service"
	rabbitmq "common/rabbitmq"
)

func RegisterMQConsumers(client *rabbitmq.Client, svc *service.Service) error {
	return newLogConsumer(client, svc.LogService).Run()
}
