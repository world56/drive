package app

import (
	"common/rdb"
	"storage/internal/config"
	minioclient "storage/internal/pkg/minio"
	"storage/internal/service"

	"github.com/minio/minio-go/v7"
	"github.com/redis/go-redis/v9"
)

type App struct {
	Config  config.Config
	Redis   *redis.Client
	Minio   *minio.Client
	Service *service.Service
}

func New() (*App, error) {
	cfg := config.Load()

	redis, err := rdb.InitRedis(cfg.REDIS_URL)
	if err != nil {
		return nil, err
	}

	minio, err := minioclient.InitMinio(
		cfg.MINIO_ADDR,
		cfg.MINIO_ACCESS_KEY,
		cfg.MINIO_ACCESS_SECRET,
	)
	if err != nil {
		return nil, err
	}

	svc := service.NewService(redis)

	return &App{
		Config:  cfg,
		Redis:   redis,
		Minio:   minio,
		Service: svc,
	}, nil
}
