package svc

import (
	"context"

	"asset/rpc/internal/config"
	"asset/rpc/internal/model"
	"common/databases"
	"common/idgen"
	interceptorclient "common/interceptor/client"
	rabbitmq "common/rabbitmq"
	"common/rdb"

	"github.com/redis/go-redis/v9"
	"github.com/zeromicro/go-zero/core/logx"
	"github.com/zeromicro/go-zero/zrpc"
	"gorm.io/gorm"

	userclient "auth/rpc/client/user"
	statsclient "stats/rpc/client/stats"
)

type ServiceContext struct {
	Config   config.Config
	DB       *gorm.DB
	Redis    *redis.Client
	RabbitMQ *rabbitmq.Client
	UserRpc  userclient.User
	StatsRpc statsclient.Stats
}

func NewServiceContext(c config.Config) *ServiceContext {
	redis, err := rdb.InitRedis(c.RedisUrl)
	logx.Must(err)
	logx.Must(idgen.HoldSnowflake(context.Background(), redis))

	db, err := databases.InitPostgresSQL(c.PostgresDSN, &model.Resource{}, &model.Favorite{}, &model.Recycle{})
	logx.Must(err)

	mq, err := rabbitmq.Open(c.RabbitMqUrl, "asset", []rabbitmq.Binding{
		{Kind: "direct", Exchange: "log", Queue: "create", RoutingKey: "create"},
		{Kind: "direct", Exchange: "resource", Queue: "upload", RoutingKey: "upload"},
		{Kind: "direct", Exchange: "resource", Queue: "remove", RoutingKey: "remove"},
	})
	logx.Must(err)

	authCli := zrpc.MustNewClient(c.AuthRpc, zrpc.WithUnaryClientInterceptor(interceptorclient.UnaryUser))
	statsCli := zrpc.MustNewClient(c.StatsRpc, zrpc.WithUnaryClientInterceptor(interceptorclient.UnaryUser))

	return &ServiceContext{
		Config:   c,
		DB:       db,
		RabbitMQ: mq,
		Redis:    redis,
		UserRpc:  userclient.NewUser(authCli),
		StatsRpc: statsclient.NewStats(statsCli),
	}
}
