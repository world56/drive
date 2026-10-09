package app

import (
	"common/idgen"
	"common/rdb"

	"storage/internal/config"
	minio "storage/internal/pkg/minio"
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
	GrpcClient *grpcclient.GrpcClients
}

func New() (*App, error) {
	cfg := config.Load()

	err := idgen.InitSnowflake(2)
	if err != nil {
		return nil, err
	}

	grpcClient, err := grpcclient.NewGrpcClients(
		cfg.GRPC_ASSET_ADDR,
	)
	if err != nil {
		return nil, err
	}

	redis, err := rdb.InitRedis(cfg.REDIS_URL)
	if err != nil {
		return nil, err
	}

	minio, err := minio.InitMinio(
		cfg.MINIO_ADDR,
		cfg.MINIO_ACCESS_KEY,
		cfg.MINIO_ACCESS_SECRET,
		cfg.MINIO_BUCKET,
	)
	if err != nil {
		return nil, err
	}

	svc := service.NewService(cfg, redis, minio, grpcClient)

	return &App{
		Config:     cfg,
		Redis:      redis,
		Minio:      minio,
		Service:    svc,
		GrpcClient: grpcClient,
	}, nil
}
