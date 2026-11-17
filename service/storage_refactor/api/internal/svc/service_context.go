// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package svc

import (
	resourceclient "asset/rpc/client/resource"
	"common/idgen"
	interceptorclient "common/interceptor/client"
	minioclient "common/minio"
	rabbitmq "common/rabbitmq"
	"common/rdb"
	"storage/api/internal/config"
	"storage/api/internal/pkg/mq"

	"github.com/minio/minio-go/v7"
	"github.com/redis/go-redis/v9"
	"github.com/zeromicro/go-zero/core/logx"
	"github.com/zeromicro/go-zero/zrpc"
)

type ServiceContext struct {
	Config   config.Config
	Minio    *minio.Core
	Redis    *redis.Client
	RabbitMQ *rabbitmq.Client
	AssetRpc resourceclient.Resource
}

func NewServiceContext(c config.Config) *ServiceContext {
	logx.Must(idgen.InitSnowflake(1))

	minioCore, err := minioclient.InitMinio(
		c.MINIO_ADDR,
		c.MINIO_ACCESS_KEY,
		c.MINIO_ACCESS_SECRET,
		c.MINIO_BUCKET,
	)
	logx.Must(err)

	redisCli, err := rdb.InitRedis(c.RedisUrl)
	logx.Must(err)

	mqCli, err := mq.InitRabbitMQ(c.RabbitMqUrl)
	logx.Must(err)

	assetCli := zrpc.MustNewClient(c.AssetRpc, zrpc.WithUnaryClientInterceptor(interceptorclient.UnaryUser))

	return &ServiceContext{
		Config:   c,
		Minio:    minioCore,
		Redis:    redisCli,
		RabbitMQ: mqCli,
		AssetRpc: resourceclient.NewResource(assetCli),
	}
}
