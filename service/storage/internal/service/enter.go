package service

import (
	rabbitmq "common/rabbitmq"
	"storage/internal/config"
	"storage/internal/pkg/minio"
	grpcclient "storage/internal/transport/grpc/client"

	"github.com/redis/go-redis/v9"
)

type Service struct {
	StatsService   *StatsService
	StorageService *StorageService
}

func NewService(
	cfg config.Config,
	redis *redis.Client,
	rabbitmq *rabbitmq.Client,
	minio *minio.Client,
	grpcClient *grpcclient.GrpcClient,
) *Service {
	return &Service{
		StatsService:   newStatsService(cfg.MINIO_BUCKET, minio),
		StorageService: newStorageService(cfg, redis, minio.Core, rabbitmq, grpcClient),
	}
}
