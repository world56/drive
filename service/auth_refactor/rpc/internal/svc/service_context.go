package svc

import (
	"context"

	"auth/rpc/internal/config"
	"auth/rpc/internal/pkg/db"
	"auth/rpc/internal/pkg/mq"

	"common/idgen"
	interceptorclient "common/interceptor/client"
	rabbitmq "common/rabbitmq"
	"common/rdb"
	statsclient "stats/rpc/client/stats"

	"github.com/redis/go-redis/v9"
	"github.com/zeromicro/go-zero/core/logx"
	"github.com/zeromicro/go-zero/zrpc"
	"gorm.io/gorm"
)

type ServiceContext struct {
	Config   config.Config
	DB       *gorm.DB
	Redis    *redis.Client
	RabbitMQ *rabbitmq.Client
	StatsRpc statsclient.Stats
}

func NewServiceContext(c config.Config) *ServiceContext {
	redis, err := rdb.InitRedis(c.RedisUrl)
	logx.Must(err)
	logx.Must(idgen.HoldSnowflake(context.Background(), redis))

	db, err := db.InitPostgresSQL(c.PostgresDSN)
	logx.Must(err)

	mq, err := mq.InitRabbitMQ(c.RabbitMqUrl)
	logx.Must(err)

	statsCli := zrpc.MustNewClient(c.StatsRpc, zrpc.WithUnaryClientInterceptor(interceptorclient.UnaryUser))

	return &ServiceContext{
		Config:   c,
		RabbitMQ: mq,
		DB:       db,
		Redis:    redis,
		StatsRpc: statsclient.NewStats(statsCli),
	}
}
