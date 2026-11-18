package svc

import (
	minioclient "common/minio"
	rabbitmq "common/rabbitmq"
	"common/rdb"
	"storage/mq/internal/config"

	"github.com/minio/minio-go/v7"
	"github.com/redis/go-redis/v9"
	"github.com/zeromicro/go-zero/core/logx"
)

type ServiceContext struct {
	Config   config.Config
	Minio    *minio.Core
	Redis    *redis.Client
	RabbitMQ *rabbitmq.Client
}

func NewServiceContext(c config.Config) *ServiceContext {
	redis, err := rdb.InitRedis(c.RedisUrl)
	logx.Must(err)

	mq, err := rabbitmq.Open(c.RabbitMqUrl, "storage-mq", []rabbitmq.Binding{
		{Kind: "direct", Exchange: "resource", Queue: "remove", RoutingKey: "remove"},
	})
	logx.Must(err)

	minioCore, err := minioclient.InitMinio(
		c.MINIO_ADDR,
		c.MINIO_ACCESS_KEY,
		c.MINIO_ACCESS_SECRET,
		c.MINIO_BUCKET,
	)
	logx.Must(err)

	return &ServiceContext{
		Config:   c,
		RabbitMQ: mq,
		Redis:    redis,
		Minio:    minioCore,
	}
}
