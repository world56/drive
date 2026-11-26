package svc

import (
	"context"

	"auth/mq/internal/config"
	"auth/mq/internal/model"

	"common/databases"
	"common/idgen"
	rabbitmq "common/rabbitmq"
	"common/rdb"

	"github.com/redis/go-redis/v9"
	"github.com/zeromicro/go-zero/core/logx"
	"gorm.io/gorm"
)

type ServiceContext struct {
	Config   config.Config
	DB       *gorm.DB
	Redis    *redis.Client
	RabbitMQ *rabbitmq.Client
}

func NewServiceContext(c config.Config) *ServiceContext {
	redis, err := rdb.InitRedis(c.RedisUrl)
	logx.Must(err)
	logx.Must(idgen.HoldSnowflake(context.Background(), redis))

	db, err := databases.InitPostgresSQL(c.PostgresDSN, &model.Log{})
	logx.Must(err)

	mq, err := rabbitmq.Open(c.RabbitMqUrl, "auth-mq", []rabbitmq.Binding{
		{Kind: "direct", Exchange: "log", Queue: "create", RoutingKey: "create"},
	})
	logx.Must(err)

	return &ServiceContext{
		Config:   c,
		DB:       db,
		Redis:    redis,
		RabbitMQ: mq,
	}
}
