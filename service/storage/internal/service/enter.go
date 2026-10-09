package service

import (
	"storage/internal/config"
	grpcclient "storage/internal/transport/grpc/client"

	minioSDK "github.com/minio/minio-go/v7"
	"github.com/redis/go-redis/v9"
)

type Service struct {
	StorageService *StorageService
}

func NewService(
	cfg config.Config,
	redis *redis.Client,
	minio *minioSDK.Core,
	grpcClient *grpcclient.GrpcClients,
) *Service {
	return &Service{
		StorageService: newStorageService(cfg, redis, minio, grpcClient),
	}
}
