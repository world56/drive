package mqconsumer

import (
	assetpb "api/asset"
	"asset/internal/pkg/mq"
	"asset/internal/service"
	"context"
	"errors"
	"log"

	amqp "github.com/rabbitmq/amqp091-go"
	"google.golang.org/protobuf/proto"
)

type ResourceConsumer struct {
	mq              *mq.Client
	resourceService *service.ResourceService
}

func NewResourceConsumer(client *mq.Client, svc *service.ResourceService) *ResourceConsumer {
	return &ResourceConsumer{
		resourceService: svc,
		mq:              client,
	}
}

func (r *ResourceConsumer) Run() error {
	deliveries, err := r.mq.Consume("upload", "asset-resource-upload")
	if err != nil {
		return err
	}

	for d := range deliveries {
		if err := r.handlerUploadFile(context.Background(), d); err != nil {
			log.Printf("upload consumer: %v", err)
			// d.Ack(false)
			d.Nack(false, true)
			continue
		}
		d.Ack(false)
	}

	return nil
}

func (c *ResourceConsumer) handlerUploadFile(ctx context.Context, d amqp.Delivery) error {
	var msg assetpb.Resource
	if err := proto.Unmarshal(d.Body, &msg); err != nil {
		return err
	}

	creatorID, _ := d.Headers["UserID"].(string)
	_, err := c.resourceService.InsertResource(
		ctx, creatorID, msg.GetName(), msg.GetObjectName(), msg.ParentID, msg.GetSize(), msg.GetPath(),
	)

	if err != nil {
		return errors.New("@-ERROR-rabbitmq-Resource processing failed")
	}

	return nil
}
