package service

import (
	"storage/internal/config"
	"storage/internal/pkg/minio"
	"storage/internal/pkg/mq"
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
	rabbitmq *mq.Client,
	minio *minio.Client,
	grpcClient *grpcclient.GrpcClients,
) *Service {
	return &Service{
		StatsService:   newStatsService(cfg.MINIO_BUCKET, minio),
		StorageService: newStorageService(cfg, redis, minio.Core, rabbitmq, grpcClient),
	}
}
