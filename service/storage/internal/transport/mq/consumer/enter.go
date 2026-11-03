package mqconsumer

import (
	rabbitmq "common/rabbitmq"
	"storage/internal/service"
)

func RegisterMqConsumers(client *rabbitmq.Client, svc *service.Service) error {
	return newAssetConsumer(client, svc.StorageService).Run()
}
