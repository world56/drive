package service

import (
	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

type FileService struct {
	db    *gorm.DB
	redis *redis.Client
}

func NewFileService(db *gorm.DB, redis *redis.Client) *FileService {
	return &FileService{
		db:    db,
		redis: redis,
	}
}
