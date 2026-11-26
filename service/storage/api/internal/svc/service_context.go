// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package svc

import (
	"context"

	resourceclient "asset/rpc/client/resource"
	"common/idgen"
	interceptorclient "common/interceptor/client"
	minioclient "common/minio"
	rabbitmq "common/rabbitmq"
	"common/rdb"
	"storage/api/internal/config"
	storageclient "storage/rpc/client/storage"

	"github.com/minio/minio-go/v7"
	"github.com/redis/go-redis/v9"
	"github.com/zeromicro/go-zero/core/logx"
	"github.com/zeromicro/go-zero/zrpc"
)

type ServiceContext struct {
	Config     config.Config
	Minio      *minio.Core
	Redis      *redis.Client
	RabbitMQ   *rabbitmq.Client
	AssetRpc   resourceclient.Resource
	StorageRpc storageclient.Storage
}

func NewServiceContext(c config.Config) *ServiceContext {
	redisCli, err := rdb.InitRedis(c.RedisUrl)
	logx.Must(err)
	logx.Must(idgen.HoldSnowflake(context.Background(), redisCli))

	minioCore, err := minioclient.InitMinio(
		c.MINIO_ADDR,
		c.MINIO_ACCESS_KEY,
		c.MINIO_ACCESS_SECRET,
		c.MINIO_BUCKET,
	)
	logx.Must(err)

	mqCli, err := rabbitmq.Open(c.RabbitMqUrl, "storage", []rabbitmq.Binding{
		{Kind: "direct", Exchange: "resource", Queue: "upload", RoutingKey: "upload"},
		{Kind: "direct", Exchange: "resource", Queue: "remove", RoutingKey: "remove"},
	})
	logx.Must(err)

	assetCli := zrpc.MustNewClient(c.AssetRpc, zrpc.WithUnaryClientInterceptor(interceptorclient.UnaryUser))
	storageCli := zrpc.MustNewClient(c.StorageRpc, zrpc.WithUnaryClientInterceptor(interceptorclient.UnaryUser))

	return &ServiceContext{
		Config:     c,
		RabbitMQ:   mqCli,
		Redis:      redisCli,
		Minio:      minioCore,
		AssetRpc:   resourceclient.NewResource(assetCli),
		StorageRpc: storageclient.NewStorage(storageCli),
	}
}
