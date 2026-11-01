package mqconsumer

import (
	storagepb "api/storage"
	"context"
	"fmt"
	"storage/internal/pkg/mq"
	"storage/internal/service"

	amqp "github.com/rabbitmq/amqp091-go"
	"google.golang.org/protobuf/proto"
)

type AssetConsumer struct {
	mq             *mq.Client
	storageService *service.StorageService
}

func newAssetConsumer(client *mq.Client, svc *service.StorageService) *AssetConsumer {
	return &AssetConsumer{
		mq:             client,
		storageService: svc,
	}
}

func (a *AssetConsumer) Run() error {
	deliveries, err := a.mq.Consume("remove", "asset-resource-remove")
	if err != nil {
		return err
	}

	for d := range deliveries {
		if err := a.onRemoveFile(context.Background(), d); err != nil {
			fmt.Println("@-asset-NACK")
			d.Nack(false, true)
			continue
		}
		d.Ack(false)
	}

	return nil
}

func (a *AssetConsumer) onRemoveFile(c context.Context, d amqp.Delivery) error {
	var msg storagepb.ObjectNames
	if err := proto.Unmarshal(d.Body, &msg); err != nil {
		return err
	}

	return a.storageService.Remove(c, msg.GetIDs())
}
