package service

import (
	"asset/internal/dto"
	"asset/internal/enum"
	"asset/internal/model"
	"context"
	"errors"
	"path/filepath"
	"strings"
	"time"

	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

type ResourceService struct {
	db    *gorm.DB
	redis *redis.Client
}

func newResourceService(db *gorm.DB, redis *redis.Client) *ResourceService {
	return &ResourceService{
		db:    db,
		redis: redis,
	}
}

func (s *ResourceService) SearchResourcesByName(c context.Context, query dto.RequestSearchResourcesByName) ([]dto.ReposesResources, error) {
	db := s.db.
		WithContext(c).
		Model(&model.Resource{}).
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

	var files []dto.ReposesResources
	if err := db.Find(&files).Error; err != nil {
		return nil, err
	}

	return files, nil
}

func (s *ResourceService) GetResources(c context.Context, body dto.RequestFiles) ([]dto.Resource, error) {
	db := s.db.WithContext(c).Order("create_time " + body.Order)

	if body.ID == nil {
		db = db.Where("parent_id IS NULL")
	} else {
		db = db.Where("parent_id = ?", *body.ID)
	}

	var files []dto.Resource
	if err := db.Find(&files).Error; err != nil {
		return nil, err
	}

	return files, nil
}

func (s *ResourceService) InsertFile(c context.Context, creatorID string, fullName, objectName string, parentID *int64, size int64) bool {
	db := s.db.WithContext(c).Model(&model.Resource{})

	ext := filepath.Ext(fullName)
	suffix := strings.TrimPrefix(ext, ".")
	baseName := strings.TrimSuffix(fullName, ext)

	err := db.Create(&model.Resource{
		Size:      size,
		Suffix:    &suffix,
		Name:      baseName,
		FullName:  fullName,
		ParentID:  parentID,
		CreatorID: creatorID,
	}).Error

	if err != nil {
		return false
	} else {
		return true
	}
}

func (s *ResourceService) MkdirFolder(c context.Context, creatorID string, data dto.RequestMkdirFolder) (bool, error) {
	db := s.db.WithContext(c)

	var folder model.Resource
	err := db.Where("name = ?", data.Name).Select("id").First(&folder).Error

	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return false, err
	} else if err == nil {
		return false, nil
	} else {
		if err := db.Create(&model.Resource{
			Name:      data.Name,
			FullName:  data.Name,
			CreatorID: creatorID,
			Remark:    data.Remark,
			ParentID:  data.ParentID,
			Type:      enum.ResourceTypeFolder,
		}).Error; err != nil {
			return false, err
		} else {
			return true, nil
		}
	}
}

func (s *ResourceService) getFilePath(c context.Context, fileID string) []dto.Path {
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
