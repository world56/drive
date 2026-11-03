package mqconsumer

import (
	assetpb "api/asset"
	"asset/internal/service"
	rabbitmq "common/rabbitmq"
	"context"
	"errors"

	amqp "github.com/rabbitmq/amqp091-go"
	"google.golang.org/protobuf/proto"
)

type AssetConsumer struct {
	mq              *rabbitmq.Client
	resourceService *service.ResourceService
}

func newAssetConsumer(client *rabbitmq.Client, svc *service.ResourceService) *AssetConsumer {
	return &AssetConsumer{
		resourceService: svc,
		mq:              client,
	}
}

func (r *AssetConsumer) Run() error {
	return r.mq.Serve("upload", "asset-resource-upload", r.onUploadFile)
}

func (a *AssetConsumer) onUploadFile(c context.Context, d amqp.Delivery) error {
	var msg assetpb.Resource
	if err := proto.Unmarshal(d.Body, &msg); err != nil {
		return rabbitmq.ErrInvalidMessage
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
