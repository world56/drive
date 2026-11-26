package listen

import (
	"asset/mq/internal/consumer"
	"asset/mq/internal/svc"
	"context"
	"log"

	"golang.org/x/sync/errgroup"
)

func Start(ctx context.Context, svcCtx *svc.ServiceContext) error {
	count := consumer.NewCountConsumer(ctx, svcCtx)
	upload := consumer.NewUploadConsumer(ctx, svcCtx)

	g, _ := errgroup.WithContext(ctx)

	g.Go(func() error {
		log.Printf("mq consumer starting: upload")
		return svcCtx.RabbitMQ.Serve("upload", "asset-resource-upload", upload.Consume)
	})

	g.Go(func() error {
		log.Printf("mq consumer starting: count")
		return svcCtx.RabbitMQ.Serve("count", "asset-resource-count", count.Consume)
	})

	return g.Wait()
}
