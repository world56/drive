package service

import (
	"auth/internal/model"
	"context"
	"errors"

	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

type AccountService struct {
	db    *gorm.DB
	redis *redis.Client
}

func NewAccountService(db *gorm.DB, r *redis.Client) *AccountService {
	return &AccountService{
		db:    db,
		redis: r,
	}
}

func (s *AccountService) HasSuperAdmin() (bool, error) {
	var count int64
	db := s.db.Model(&model.User{}).Where("role = ?", model.RoleAdmin).Limit(1).Count(&count)
	if db.Error != nil {
		return false, db.Error
	}
	if count == 0 {
		return false, nil
	} else {
		return true, nil
	}
}

func (s *AccountService) RegisterSuperAdmin(body context.Context, token []byte) (bool, error) {
	has, err := s.HasSuperAdmin()
	if err != nil || has {
		return false, errors.New("Illegal request")
	}

	return has, nil
}
