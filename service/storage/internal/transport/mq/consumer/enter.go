package mqconsumer

import (
	rabbitmq "common/rabbitmq"
	"storage/internal/service"
)

func RegisterMQConsumers(client *rabbitmq.Client, svc *service.Service) error {
	return newAssetConsumer(client, svc.StorageService).Run()
}
