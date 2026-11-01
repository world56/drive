package mqconsumer

import (
	"asset/internal/pkg/mq"
	"asset/internal/service"
)

func RegisterMQConsumers(client *mq.Client, svc *service.Service) error {
	return newAssetConsumer(client, svc.ResourceService).Run()
}
