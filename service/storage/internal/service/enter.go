package service

import (
	"storage/internal/config"

	minioSDK "github.com/minio/minio-go/v7"
	"github.com/redis/go-redis/v9"
)

type Service struct {
	StorageService *StorageService
}

func NewService(cfg config.Config, redis *redis.Client, minio *minioSDK.Core) *Service {
	return &Service{
		StorageService: newStorageService(cfg, redis, minio),
	}
}
