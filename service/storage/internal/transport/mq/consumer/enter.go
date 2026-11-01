package mqconsumer

import (
	"storage/internal/pkg/mq"
	"storage/internal/service"
)

func RegisterMqConsumers(client *mq.Client, svc *service.Service) error {
	return newAssetConsumer(client, svc.StorageService).Run()
}
