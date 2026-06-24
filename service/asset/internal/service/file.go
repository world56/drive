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

func newFileService(db *gorm.DB, redis *redis.Client) *FileService {
	return &FileService{
		db:    db,
		redis: redis,
	}
}

func (s *FileService) SearchFilesByName(c context.Context, query dto.RequestSearchFilesByName) ([]dto.ReposesFiles, error) {
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

	var files []dto.ReposesFiles
	if err := db.Find(&files).Error; err != nil {
		return nil, err
	}

	return files, nil
}

func (s *FileService) getFilePath(c context.Context, fileID string) []dto.Path {
	var Paths []dto.Path
	SQL := `
		WITH RECURSIVE resources AS (
			SELECT id, name, parent_id FROM files WHERE id = ?
			UNION ALL
			SELECT r.id, r.name, r.parent_id
			FROM files AS f
			JOIN resources AS a ON a.parent_id = f.id
		)
		SELECT id, name FROM resources;
	`
	if err := s.db.WithContext(c).Raw(SQL, fileID).Scan(&Paths).Error; err != nil {
		return nil
	}
	return Paths
}
