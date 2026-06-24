package service

import "github.com/redis/go-redis/v9"

type Service struct {
	StorageService *StorageService
}

func NewService(redis *redis.Client) *Service {
	return &Service{
		StorageService: newStorageService(redis),
	}
}
