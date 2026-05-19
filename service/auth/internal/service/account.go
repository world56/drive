package service

import (
	"auth/internal/dto"
	"auth/internal/model"
	"auth/internal/pkg/utils"
	"context"
	"encoding/json"
	"errors"
	"strconv"
	"time"

	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

type AccountService struct {
	db            *gorm.DB
	redis         *redis.Client
	cryptoService *CryptoService
	LogService    *LogService
}

func NewAccountService(d *gorm.DB, r *redis.Client, c *CryptoService, l *LogService) *AccountService {
	return &AccountService{
		db:            d,
		redis:         r,
		LogService:    l,
		cryptoService: c,
	}
}

func (s *AccountService) HasSuperAdmin() (bool, error) {
	var count int64
	db := s.db.
		Model(&model.User{}).
		Where("role = ?", model.UserRoleAdmin).
		Limit(1).
		Count(&count)

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

	user.Name = "Administrator"
	user.Role = model.UserRoleAdmin
	pwd, err := s.cryptoService.HashPassword(user.Password)
	if err != nil {
		return err
	}

	user.Password = pwd
	return s.db.Create(&user).Error
}

func (s *AccountService) Login(c context.Context, token []byte) (string, error) {
	body, err := s.cryptoService.Decrypt(c, string(token))
	if err != nil {
		return "", err
	}

	var login model.User
	if err := json.Unmarshal(body, &login); err != nil {
		return "", err
	}

	var user model.User
	if err := s.db.WithContext(c).
		Select("id", "name", "account", "role", "status", "password").
		Where("account = ?", login.Account).
		First(&user).Error; err != nil {
		return "", errors.New("Account Password Error")
	}

	if user.Status == model.UserStatusFreeze {
		return "", errors.New("Account Frozen, Please Contact The Administrator")
	}

	valid, err := s.cryptoService.VerifyPassword(login.Password, user.Password)
	if err != nil {
		return "", err
	}
	if !valid {
		return "", errors.New("Account Password Error")
	}

	UserID := user.ID.String()

	userRedisKey := "drive:user:" + UserID
	userInfo := map[string]interface{}{
		"id":      UserID,
		"name":    user.Name,
		"role":    user.Role,
		"status":  user.Status,
		"account": user.Account,
	}

	if err := s.redis.
		HSet(c, userRedisKey, userInfo).
		Err(); err != nil {
		return "", err
	}

	if err := s.redis.
		Expire(c, userRedisKey, 7*24*time.Hour).
		Err(); err != nil {
		return "", err
	}

	s.LogService.WriteLog(c, &dto.WriteLog{
		UserID: UserID,
		Desc:   userInfo,
		Event:  model.LogEventLogin,
	})

	return utils.CreateJWT(UserID)
}

func (s *AccountService) GetUserInfo(c context.Context, UserID string) (*dto.ResponseUserLoginInfo, error) {
	user, err := s.redis.HGetAll(c, "drive:user:"+UserID).Result()
	if err != nil {
		return nil, err
	}

	if len(user) == 0 {
		return nil, errors.New("Login timeout")
	}

	role, err := strconv.Atoi(user["role"])
	if err != nil {
		return nil, errors.New("Failed to acquire a character")
	}

	return &dto.ResponseUserLoginInfo{
		Role:    role,
		ID:      user["id"],
		Name:    user["name"],
		Account: user["account"],
	}, nil
}

func (s *AccountService) Logout(c context.Context, UserID string) bool {
	userKey := "drive:user:" + UserID

	user, err := s.GetUserInfo(c, UserID)
	if err != nil {
		return false
	}

	s.LogService.WriteLog(c, &dto.WriteLog{
		Desc:   user,
		UserID: UserID,
		Event:  model.LogEventLogOut,
	})

	s.redis.Del(c, userKey)
	return true
}
