package svc

import (
	"asset/mq/internal/config"
	"asset/mq/internal/pkg/db"
	"asset/mq/internal/pkg/mq"

	logclient "auth/rpc/client/log"
	"common/idgen"
	interceptorclient "common/interceptor/client"
	rabbitmq "common/rabbitmq"
	"common/rdb"

	"github.com/redis/go-redis/v9"
	"github.com/zeromicro/go-zero/core/logx"
	"github.com/zeromicro/go-zero/zrpc"
	"gorm.io/gorm"
)

type ServiceContext struct {
	DB       *gorm.DB
	Redis    *redis.Client
	Config   config.Config
	RabbitMQ *rabbitmq.Client
	LogRpc   logclient.Log
}

func NewServiceContext(c config.Config) *ServiceContext {
	logx.Must(idgen.InitSnowflake(1))

	redis, err := rdb.InitRedis(c.RedisUrl)
	logx.Must(err)

	db, err := db.InitPostgresSQL(c.PostgresDSN)
	logx.Must(err)

	mq, err := mq.InitRabbitMQ(c.RabbitMqUrl)
	logx.Must(err)

	authCli := zrpc.MustNewClient(c.AuthRpc, zrpc.WithUnaryClientInterceptor(interceptorclient.UnaryUser))

	return &ServiceContext{
		Config:   c,
		RabbitMQ: mq,
		DB:       db,
		Redis:    redis,
		LogRpc:   logclient.NewLog(authCli),
	}
}
