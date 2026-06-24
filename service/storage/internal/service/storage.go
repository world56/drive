package service

import "github.com/redis/go-redis/v9"

type StorageService struct {
	redis *redis.Client
}

func newStorageService(redis *redis.Client) *StorageService {
	return &StorageService{
		redis: redis,
	}
}
