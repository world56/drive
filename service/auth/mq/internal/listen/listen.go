package listen

import (
	"auth/mq/internal/consumer"
	"auth/mq/internal/svc"
	"context"
	"log"

	"golang.org/x/sync/errgroup"
)

func Start(ctx context.Context, svcCtx *svc.ServiceContext) error {
	logC := consumer.NewLogConsumer(ctx, svcCtx)

	g, _ := errgroup.WithContext(ctx)

	g.Go(func() error {
		log.Printf("mq consumer starting: log")
		return svcCtx.RabbitMQ.Serve("create", "auth-log-create", logC.Consume)
	})

	return g.Wait()
}
