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
		db = db.Where("event = ?", *query.Event)
	}
	if query.UserID != nil {
		db = db.Where("user_id = ?", *query.UserID)
	}

	var count int64
	if err := db.Count(&count).Error; err != nil {
		return nil, err
	}

	var modelLogs []model.Log
	if err := db.
		Preload("User").
		Order("create_time DESC").
		Offset((query.CurrentPage - 1) * query.PageSize).
		Limit(query.PageSize).
		Find(&modelLogs).Error; err != nil {
		return nil, err
	}

	logs := make([]dto.Log, len(modelLogs))
	for i, l := range modelLogs {
		logs[i] = dto.Log{
			ID:         l.ID.String(),
			Event:      l.Event,
			Desc:       l.Desc,
			CreateTime: l.CreateTime,
			UserID:     l.UserID,
			User: dto.UserBasicInfo{
				ID:   l.User.ID.String(),
				Name: l.User.Name,
			},
		}
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
