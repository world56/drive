package app

import (
	"common/rdb"
	"stats/internal/config"
	"stats/internal/service"
	grpcclient "stats/internal/transport/grpc/client"

	"github.com/redis/go-redis/v9"
)

type App struct {
	Config     config.Config
	Redis      *redis.Client
	Service    *service.Service
	GrpcClient *grpcclient.GrpcClient
}

func New() (*App, error) {
	a := &App{
		Config: config.Load(),
	}

	var err error
	if a.Redis, err = rdb.InitRedis(a.Config.REDIS_URL); err != nil {
		return a, err
	}

	if a.GrpcClient, err = grpcclient.NewGrpcClient(a.Config.GRPC_STORAGE_ADDR); err != nil {
		return a, err
	}

	a.Service = service.NewService(a.Redis, a.GrpcClient)

	return a, nil
}

func (a *App) Close() {
	if a.Redis != nil {
		a.Redis.Close()
	}

	if a.GrpcClient != nil {
		a.GrpcClient.Close()
	}
}
