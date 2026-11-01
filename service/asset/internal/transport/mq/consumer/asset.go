package mqconsumer

import (
	assetpb "api/asset"
	"asset/internal/pkg/mq"
	"asset/internal/service"
	"context"
	"errors"

	amqp "github.com/rabbitmq/amqp091-go"
	"google.golang.org/protobuf/proto"
)

type AssetConsumer struct {
	mq              *mq.Client
	resourceService *service.ResourceService
}

func newAssetConsumer(client *mq.Client, svc *service.ResourceService) *AssetConsumer {
	return &AssetConsumer{
		resourceService: svc,
		mq:              client,
	}
}

func (r *AssetConsumer) Run() error {
	deliveries, err := r.mq.Consume("upload", "asset-resource-upload")
	if err != nil {
		return err
	}

	for d := range deliveries {
		if err := r.onUploadFile(context.Background(), d); err != nil {
			d.Nack(false, true)
			continue
		}
		d.Ack(false)
	}

	return nil
}

func (a *AssetConsumer) onUploadFile(c context.Context, d amqp.Delivery) error {
	var msg assetpb.Resource
	if err := proto.Unmarshal(d.Body, &msg); err != nil {
		return err
	}

	creatorID, _ := d.Headers["UserID"].(string)
	_, err := a.resourceService.InsertResource(
		c, creatorID, msg.GetName(), msg.GetObjectName(), msg.ParentID, msg.GetSize(), msg.GetPath(),
	)

	if err != nil {
		return errors.New("@-ERROR-rabbitmq-Resource processing failed")
	}

	return nil
}
