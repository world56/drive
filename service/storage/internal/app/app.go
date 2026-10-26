package app

import (
	"common/idgen"
	"common/rdb"

	"storage/internal/config"
	minio "storage/internal/pkg/minio"

	"storage/internal/pkg/mq"
	"storage/internal/service"
	grpcclient "storage/internal/transport/grpc/client"

	minioSDK "github.com/minio/minio-go/v7"
	"github.com/redis/go-redis/v9"
)

type App struct {
	Config     config.Config
	Redis      *redis.Client
	Minio      *minioSDK.Core
	Service    *service.Service
	RabbitMQ   *mq.Client
	GrpcClient *grpcclient.GrpcClients
}

func New() (*App, error) {
	a := &App{
		Config: config.Load(),
	}

	err := idgen.InitSnowflake(2)
	if err != nil {
		return a, err
	}

	if a.GrpcClient, err = grpcclient.NewGrpcClients(a.Config.GRPC_ASSET_ADDR); err != nil {
		return a, err
	}

	if a.RabbitMQ, err = mq.InitRabbitMQ(a.Config.RABBITMQ_URL); err != nil {
		return a, err
	}

	if a.Redis, err = rdb.InitRedis(a.Config.REDIS_URL); err != nil {
		return a, err
	}

	if a.Minio, err = minio.InitMinio(
		a.Config.MINIO_ADDR,
		a.Config.MINIO_ACCESS_KEY,
		a.Config.MINIO_ACCESS_SECRET,
		a.Config.MINIO_BUCKET,
	); err != nil {
		return a, err
	}

	a.Service = service.NewService(a.Config, a.Redis, a.RabbitMQ, a.Minio, a.GrpcClient)

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
}
