package svc

import (
	"context"

	"asset/mq/internal/config"
	"asset/mq/internal/model"

	"common/databases"
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
	StatsRpc statsclient.Stats
}

func NewServiceContext(c config.Config) *ServiceContext {
	redis, err := rdb.InitRedis(c.RedisUrl)
	logx.Must(err)
	logx.Must(idgen.HoldSnowflake(context.Background(), redis))

	db, err := databases.InitPostgresSQL(c.PostgresDSN, &model.Resource{})
	logx.Must(err)

	mq, err := rabbitmq.Open(c.RabbitMqUrl, "asset-mq", []rabbitmq.Binding{
		{Kind: "direct", Exchange: "resource", Queue: "count", RoutingKey: "count"},
		{Kind: "direct", Exchange: "resource", Queue: "upload", RoutingKey: "upload"},
		{Kind: "direct", Exchange: "log", Queue: "create", RoutingKey: "create"},
	})
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
