package mqconsumer

import (
	storagepb "api/storage"
	rabbitmq "common/rabbitmq"
	"context"
	"storage/internal/service"

	amqp "github.com/rabbitmq/amqp091-go"
	"google.golang.org/protobuf/proto"
)

type AssetConsumer struct {
	mq             *rabbitmq.Client
	storageService *service.StorageService
}

func newAssetConsumer(client *rabbitmq.Client, svc *service.StorageService) *AssetConsumer {
	return &AssetConsumer{
		mq:             client,
		storageService: svc,
	}
}

func (a *AssetConsumer) Run() error {
	return a.mq.Serve("remove", "storage-resource-remove", a.onRemoveFile)
}

func (a *AssetConsumer) onRemoveFile(c context.Context, d amqp.Delivery) error {
	var msg storagepb.ObjectNames
	if err := proto.Unmarshal(d.Body, &msg); err != nil {
		return rabbitmq.ErrInvalidMessage
	}

	return a.storageService.Remove(c, msg.GetIDs())
}
