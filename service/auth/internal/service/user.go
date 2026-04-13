package service

import (
	"auth/internal/dto"
	"auth/internal/model"
	"context"

	"gorm.io/gorm"
)

type UserService struct {
	db *gorm.DB
}

func NewUserService(db *gorm.DB) *UserService {
	return &UserService{
		db: db,
	}
}

func (s *UserService) FindUsers(context context.Context, query dto.RequestFindUsersQuery) (*dto.ResponseFindUsersDTO, error) {
	db := s.db.WithContext(context).Model(&model.User{})

	if query.Account != nil {
		db = db.Where("account = ?", *query.Account)
	}
	if query.Name != nil {
		db = db.Where("name = ?", *query.Name)
	}

	var count int64
	if err := db.Count(&count).Error; err != nil {
		return nil, err
	}

	offset := (query.CurrentPage - 1) * query.PageSize
	var users []model.User
	if err := db.Select("name", "account").Offset(offset).Limit(query.PageSize).Find(&users).Error; err != nil {
		return nil, err
	}

	return &dto.ResponseFindUsersDTO{
		Users: users,
		Count: int(count),
	}, nil
}
