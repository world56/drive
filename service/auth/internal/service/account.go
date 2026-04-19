package service

import (
	"auth/internal/model"
	"auth/internal/pkg/utils"
	"context"
	"crypto/md5"
	"encoding/hex"
	"encoding/json"
	"errors"

	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

type AccountService struct {
	db            *gorm.DB
	redis         *redis.Client
	cryptoService *CryptoService
}

func NewAccountService(d *gorm.DB, r *redis.Client, c *CryptoService) *AccountService {
	return &AccountService{
		db:            d,
		redis:         r,
		cryptoService: c,
	}
}

func (s *AccountService) createJWT() {

}

func (s *AccountService) HasSuperAdmin() (bool, error) {
	var count int64
	db := s.db.Model(&model.User{}).Where("role = ?", model.UserRoleAdmin).Limit(1).Count(&count)
	if db.Error != nil {
		return false, db.Error
	}
	if count == 0 {
		return false, nil
	} else {
		return true, nil
	}
}

func (s *AccountService) Register(context context.Context, token []byte) error {
	has, err := s.HasSuperAdmin()
	if err != nil || has {
		return errors.New("Illegal request")
	}

	body, err := s.cryptoService.Decrypt(context, string(token))
	if err != nil {
		return err
	}

	var user model.User
	if err := json.Unmarshal(body, &user); err != nil {
		return err
	}

	user.Role = model.UserRoleAdmin
	bytes := md5.Sum([]byte(user.Password))
	user.Password = hex.EncodeToString(bytes[:])
	return s.db.Create(user).Error
}

func (s *AccountService) Login(c context.Context, token []byte) (string, error) {
	body, err := s.cryptoService.Decrypt(c, string(token))
	if err != nil {
		return "", err
	}

	var user = model.User{}
	if err := json.Unmarshal(body, &user); err != nil {
		return "", err
	}

	return utils.CreateJWT(user.ID.String())
}
