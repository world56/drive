package svc

import (
	"asset/rpc/internal/config"
	"asset/rpc/internal/pkg/db"
	"asset/rpc/internal/pkg/mq"
	"common/idgen"
	rabbitmq "common/rabbitmq"
	"common/rdb"

	"github.com/redis/go-redis/v9"
	"github.com/zeromicro/go-zero/core/logx"
	"github.com/zeromicro/go-zero/zrpc"
	"gorm.io/gorm"

	logclient "auth/rpc/client/log"
	userclient "auth/rpc/client/user"
)

type ServiceContext struct {
	Config   config.Config
	DB       *gorm.DB
	Redis    *redis.Client
	RabbitMQ *rabbitmq.Client
	LogRpc   logclient.Log
	UserRpc  userclient.User
}

func NewServiceContext(c config.Config) *ServiceContext {
	logx.Must(idgen.InitSnowflake(1))

	redis, err := rdb.InitRedis(c.RedisUrl)
	logx.Must(err)

	db, err := db.InitPostgresSQL(c.PostgresDSN)
	logx.Must(err)

	mq, err := mq.InitRabbitMQ(c.RabbitMqUrl)
	logx.Must(err)

	authCli := zrpc.MustNewClient(c.AuthRpc)

	return &ServiceContext{
		Config:   c,
		DB:       db,
		RabbitMQ: mq,
		Redis:    redis,
		LogRpc:   logclient.NewLog(authCli),
		UserRpc:  userclient.NewUser(authCli),
	}
}
