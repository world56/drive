package svc

import (
	resourceclient "asset/rpc/client/resource"
	interceptorclient "common/interceptor/client"
	minioclient "common/minio"
	rabbitmq "common/rabbitmq"
	"storage/rpc/internal/config"
	minioadmin "storage/rpc/internal/pkg/minio_admin"

	"github.com/minio/minio-go/v7"
	"github.com/zeromicro/go-zero/core/logx"
	"github.com/zeromicro/go-zero/zrpc"
)

type ServiceContext struct {
	Config      config.Config
	MinioAdmin  *minioadmin.Admin
	MinioClient *minio.Core
	AssetRpc    resourceclient.Resource
	RabbitMQ    *rabbitmq.Client
}

func NewServiceContext(c config.Config) *ServiceContext {
	admin, err := minioadmin.InitAdmin(
		c.MINIO_ADDR,
		c.MINIO_ACCESS_KEY,
		c.MINIO_ACCESS_SECRET,
	)
	logx.Must(err)

	mqCli, err := rabbitmq.Open(c.RabbitMqUrl, "storage", []rabbitmq.Binding{
		{Kind: "direct", Exchange: "log", Queue: "create", RoutingKey: "create"},
		{Kind: "direct", Exchange: "resource", Queue: "count", RoutingKey: "count"},
	})
	logx.Must(err)

	minioClient, err := minioclient.InitMinio(
		c.MINIO_ADDR,
		c.MINIO_ACCESS_KEY,
		c.MINIO_ACCESS_SECRET,
		c.MINIO_BUCKET,
	)
	logx.Must(err)

	assetCli := zrpc.MustNewClient(c.AssetRpc, zrpc.WithUnaryClientInterceptor(interceptorclient.UnaryUser))

	return &ServiceContext{
		Config:      c,
		RabbitMQ:    mqCli,
		MinioAdmin:  admin,
		MinioClient: minioClient,
		AssetRpc:    resourceclient.NewResource(assetCli),
	}
}
