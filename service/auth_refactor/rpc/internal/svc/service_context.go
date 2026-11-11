package svc

import (
	"auth/rpc/internal/config"
	"auth/rpc/internal/pkg/db"
	"auth/rpc/internal/pkg/mq"

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
	logx.Must(idgen.InitSnowflake(1))

	redis, err := rdb.InitRedis(c.RedisUrl)
	logx.Must(err)

	db, err := db.InitPostgresSQL(c.PostgresDSN)
	logx.Must(err)

	mq, err := mq.InitRabbitMQ(c.RabbitMqUrl)
	logx.Must(err)

	return &ServiceContext{
		Config:   c,
		RabbitMQ: mq,
		DB:       db,
		Redis:    redis,
	}
}
