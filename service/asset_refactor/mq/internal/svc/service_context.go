package svc

import (
	"context"

	"asset/mq/internal/config"
	"asset/mq/internal/pkg/db"

	logclient "auth/rpc/client/log"
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
	DB       *gorm.DB
	Redis    *redis.Client
	Config   config.Config
	RabbitMQ *rabbitmq.Client
	LogRpc   logclient.Log
	StatsRpc statsclient.Stats
}

func NewServiceContext(c config.Config) *ServiceContext {
	redis, err := rdb.InitRedis(c.RedisUrl)
	logx.Must(err)
	logx.Must(idgen.HoldSnowflake(context.Background(), redis))

	db, err := db.InitPostgresSQL(c.PostgresDSN)
	logx.Must(err)

	mq, err := rabbitmq.Open(c.RabbitMqUrl, "asset-mq", []rabbitmq.Binding{
		{Kind: "direct", Exchange: "resource", Queue: "upload", RoutingKey: "upload"},
	})
	logx.Must(err)

	authCli := zrpc.MustNewClient(c.AuthRpc, zrpc.WithUnaryClientInterceptor(interceptorclient.UnaryUser))
	statsCli := zrpc.MustNewClient(c.StatsRpc, zrpc.WithUnaryClientInterceptor(interceptorclient.UnaryUser))

	return &ServiceContext{
		Config:   c,
		RabbitMQ: mq,
		DB:       db,
		Redis:    redis,
		LogRpc:   logclient.NewLog(authCli),
		StatsRpc: statsclient.NewStats(statsCli),
	}
}
