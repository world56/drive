package mqconsumer

import (
	"asset/internal/service"
	rabbitmq "common/rabbitmq"
)

func RegisterMQConsumers(client *rabbitmq.Client, svc *service.Service) error {
	return newAssetConsumer(client, svc.ResourceService).Run()
}
