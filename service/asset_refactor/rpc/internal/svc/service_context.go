package svc

import (
	"asset/rpc/internal/config"
	"asset/rpc/internal/pkg/db"
	"asset/rpc/internal/pkg/mq"
	"common/idgen"
	interceptorclient "common/interceptor/client"
	rabbitmq "common/rabbitmq"
	"common/rdb"

	"github.com/redis/go-redis/v9"
	"github.com/zeromicro/go-zero/core/logx"
	"github.com/zeromicro/go-zero/zrpc"
	"gorm.io/gorm"

	logclient "auth/rpc/client/log"
	userclient "auth/rpc/client/user"
	statsclient "stats/rpc/client/stats"
)

type ServiceContext struct {
	Config   config.Config
	DB       *gorm.DB
	Redis    *redis.Client
	RabbitMQ *rabbitmq.Client
	LogRpc   logclient.Log
	UserRpc  userclient.User
	StatsRpc statsclient.Stats
}

func NewServiceContext(c config.Config) *ServiceContext {
	logx.Must(idgen.InitSnowflake(idgen.NodeAsset))

	redis, err := rdb.InitRedis(c.RedisUrl)
	logx.Must(err)

	db, err := db.InitPostgresSQL(c.PostgresDSN)
	logx.Must(err)

	mq, err := mq.InitRabbitMQ(c.RabbitMqUrl)
	logx.Must(err)

	authCli := zrpc.MustNewClient(c.AuthRpc, zrpc.WithUnaryClientInterceptor(interceptorclient.UnaryUser))
	statsCli := zrpc.MustNewClient(c.StatsRpc, zrpc.WithUnaryClientInterceptor(interceptorclient.UnaryUser))

	return &ServiceContext{
		Config:   c,
		DB:       db,
		RabbitMQ: mq,
		Redis:    redis,
		LogRpc:   logclient.NewLog(authCli),
		UserRpc:  userclient.NewUser(authCli),
		StatsRpc: statsclient.NewStats(statsCli),
	}
}
