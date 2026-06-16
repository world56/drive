package service

import (
	"asset/internal/dto"
	"asset/internal/enum"
	"asset/internal/model"
	"context"
	"time"

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

func (s *FileService) SearchFilesByName(c context.Context, query dto.SearchFilesByName) {
	db := s.db.
		WithContext(c).
		Model(&model.File{}).
		Select("id", "path", "type", "suffix", "parent_id", "full_name", "create_time").
		Where("remove = ?", 0).
		Where("name = ?", query.Name)

	if len(query.Type) > 0 {
		db = db.Where("type IN ?", query.Type)
	}
	if query.StartTime != nil && query.EndTime != nil {
		endTime := time.Unix(*query.EndTime, 0)
		startTime := time.Unix(*query.StartTime, 0)
		db = db.Where("create_time >= ? AND create_time <= ?", startTime, endTime)
	}
	if query.Sort != nil {
		db = db.Order("create_time " + *query.Sort)
	} else {
		db = db.Order("create_time " + enum.SortDesc)
	}

}

func (s *FileService) getFilePath(fileID string) {}
