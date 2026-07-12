package service

import (
	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

type Service struct {
	ResourceService *ResourceService
}

func NewService(db *gorm.DB, redis *redis.Client) *Service {
	return &Service{
		ResourceService: newResourceService(db, redis),
	}
}
