package app

import (
	"asset/internal/config"
	"asset/internal/pkg/db"
	"asset/internal/pkg/mq"
	"asset/internal/service"
	grpcclient "asset/internal/transport/grpc/client"
	"common/databases"
	"common/idgen"
	"common/rdb"

	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

type App struct {
	DB         *gorm.DB
	RabbitMQ   *mq.Client
	Redis      *redis.Client
	Config     config.Config
	Service    *service.Service
	GrpcClient *grpcclient.GrpcClient
}

func New() (*App, error) {
	a := &App{
		Config: config.Load(),
	}

	err := idgen.InitSnowflake(1)
	if err != nil {
		return a, err
	}

	if a.RabbitMQ, err = mq.InitRabbitMQ(a.Config.RABBITMQ_URL); err != nil {
		return a, err
	}

	if a.Redis, err = rdb.InitRedis(a.Config.REDIS_URL); err != nil {
		return a, err
	}

	if a.DB, err = db.InitPostgresSQL(a.Config.POSTGRES_DSN); err != nil {
		return a, err
	}

	if a.GrpcClient, err = grpcclient.NewGrpcClients(a.Config.GRPC_STATS_ADDR); err != nil {
		return a, err
	}

	a.Service = service.NewService(a.DB, a.Redis, a.GrpcClient)

	return a, nil
}

func (a *App) Close() {
	if a == nil {
		return
	}

	if a.Redis != nil {
		a.Redis.Close()
	}

	if a.RabbitMQ != nil {
		a.RabbitMQ.Close()
	}

	if a.GrpcClient != nil {
		a.GrpcClient.Close()
	}

	databases.Close(a.DB)
}
