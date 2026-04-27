package service

import (
	"auth/internal/dto"
	"auth/internal/model"
	"context"

	"gorm.io/gorm"
)

type LogService struct {
	db *gorm.DB
}

func NewLogService(db *gorm.DB) *LogService {
	return &LogService{
		db: db,
	}
}

func (s *LogService) FindLogs(context context.Context, query dto.RequestFindLogsDTO) (*dto.ResponseFindLogsDTO, error) {
	db := s.db.WithContext(context).Model(&model.Log{})

	if query.Event != nil {
		db = db.Where("event = ?", *query.Event)
	}
	if query.UserId != nil {
		db = db.Where("user_id = ?", *query.UserId)
	}

	var count int64
	if err := db.Count(&count).Error; err != nil {
		return nil, err
	}

	var logs []dto.Log
	if err := db.
		Order("create_time DESC").
		Offset((query.CurrentPage - 1) * query.PageSize).
		Limit(query.PageSize).
		Find(&logs).Error; err != nil {
		return nil, err
	}

	return &dto.ResponseFindLogsDTO{
		Count: count,
		List:  logs,
	}, nil
}
