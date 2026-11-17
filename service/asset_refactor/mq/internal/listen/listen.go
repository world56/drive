package listen

import (
	"asset/mq/internal/config"
	"asset/mq/internal/consumer"
	"asset/mq/internal/svc"
	rabbitmq "common/rabbitmq"
	"context"
)

type Runner struct {
	Name string
	Run  func() error
}

func Mqs(c config.Config, ctx context.Context, svcCtx *svc.ServiceContext) []Runner {
	upload := consumer.NewUploadConsumer(ctx, svcCtx)

	return []Runner{
		{
			Name: "upload",
			Run: func() error {
				cli, err := rabbitmq.Open(c.RabbitMqUrl, "asset-upload", []rabbitmq.Binding{
					{Kind: "direct", Exchange: "resource", Queue: "upload", RoutingKey: "upload"},
				})
				if err != nil {
					return err
				}
				return cli.Serve("upload", "asset-resource-upload", upload.Consume)
			},
		},
	}

}
