package service

import (
	"auth/internal/dto"
	"auth/internal/model"
	"auth/internal/pkg/utils"
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
		db = db.Where("logs.event = ?", *query.Event)
	}
	if query.UserID != nil {
		db = db.Where("logs.user_id = ?", *query.UserID)
	}

	var count int64
	if err := db.Session(&gorm.Session{}).Count(&count).Error; err != nil {
		return nil, err
	}

	var logs []dto.Log
	if err := db.Select(`
		logs.id,
		logs.desc,
		logs.event,
		logs.user_id,
		logs.create_time,
		users.name AS user_name,
		users.account as user_account
	`).
		Joins("LEFT JOIN users ON users.id = logs.user_id").
		Order("logs.create_time DESC").
		Limit(query.PageSize).
		Offset((query.CurrentPage - 1) * query.PageSize).
		Scan(&logs).Error; err != nil {
		return nil, err
	}

	return &dto.ResponseFindLogsDTO{
		List:  logs,
		Count: count,
	}, nil
}

// 写入日志
func (s *LogService) WriteLog(c context.Context, log *dto.WriteLog) error {
	if err := s.db.WithContext(c).
		Create(&model.Log{
			Event:  log.Event,
			UserID: log.UserID,
			Desc:   utils.ToDescString(log.Desc),
		}).Error; err != nil {
		return errors.New("Log write failed")
	}
	return nil
}
