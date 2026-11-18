package listen

import (
	"context"
	"log"
	"storage/mq/internal/consumer"
	"storage/mq/internal/svc"

	"golang.org/x/sync/errgroup"
)

func Start(ctx context.Context, svcCtx *svc.ServiceContext) error {
	remove := consumer.NewRemoveConsumer(ctx, svcCtx)

	g, _ := errgroup.WithContext(ctx)

	g.Go(func() error {
		log.Printf("mq consumer starting: remove")
		return svcCtx.RabbitMQ.Serve("remove", "storage-resource-remove", remove.Consume)
	})

	return g.Wait()
}
