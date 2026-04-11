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

func (s *UserService) FindUsers(context context.Context, query dto.RequestFindUsersQuery) error {
	db := s.db.WithContext(context).Model(&model.User{})

	if query.Account != nil {
		db = db.Where("account = ?", query.Account)
	}
	if query.Name != nil {
		db = db.Where("Name = ?", query.Name)
	}

	var count int64
	if err := db.Count(&count); err != nil {
		return nil
	}

	return nil
}
