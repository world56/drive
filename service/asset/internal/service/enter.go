package service

import (
	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

type Service struct {
	FileService *FileService
}

func NewService(db *gorm.DB, redis *redis.Client) *Service {
	return &Service{
		FileService: newFileService(db, redis),
	}
}
