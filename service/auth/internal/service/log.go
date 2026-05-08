package service

import (
	"auth/internal/dto"
	"auth/internal/model"
	"context"
	"errors"

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

func (s *LogService) FindLogs(c context.Context, query dto.RequestFindLogsDTO) (*dto.ResponseFindLogsDTO, error) {
	db := s.db.WithContext(c).Model(&model.Log{})

	if query.Event != nil {
		db = db.Where("event = ?", *query.Event)
	}
	if query.UserID != nil {
		db = db.Where("user_id = ?", *query.UserID)
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

// 写入日志
func (s *LogService) WriteLog(c context.Context, log *dto.WriteLog) error {
	if err := s.db.WithContext(c).
		Create(&model.Log{
			Desc:   log.Desc,
			Event:  log.Event,
			UserID: log.UserID,
		}).Error; err != nil {
		return errors.New("Log write failed")
	}
	return nil
}
