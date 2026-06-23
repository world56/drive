package service

import (
	"auth/internal/dto"
	"auth/internal/enum"
	"auth/internal/model"
	"auth/internal/pkg/utils"
	grpcclient "auth/internal/transport/grpc/client"
	"context"
	"encoding/json"
	"errors"
	"strconv"
	"time"

	"common/rdb"

	"gorm.io/gorm"
)

type AccountService struct {
	db            *gorm.DB
	redis         *rdb.Client
	logService    *LogService
	cryptoService *CryptoService
	grpcClient    *grpcclient.GrpcClients
}

func NewAccountService(d *gorm.DB,
	r *rdb.Client,
	c *CryptoService,
	l *LogService,
	g *grpcclient.GrpcClients,
) *AccountService {
	return &AccountService{
		db:            d,
		redis:         r,
		logService:    l,
		grpcClient:    g,
		cryptoService: c,
	}
}

func (s *AccountService) HasSuperAdmin() (bool, error) {
	var count int64
	db := s.db.
		Model(&model.User{}).
		Where("role = ?", enum.UserRoleAdmin).
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
	user.Role = enum.UserRoleAdmin
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

	if user.Status == enum.UserStatusFreeze {
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

	s.logService.WriteLog(c, &dto.WriteLog{
		UserID: UserID,
		Desc:   userInfo,
		Event:  enum.LogEventLogin,
	})

	return utils.CreateJWT(UserID)
}

func (s *AccountService) GetUserByID(c context.Context, UserID string) (*dto.ResponseUserLoginInfo, error) {
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

	s.grpcClient.Stats.Access(UserID)

	return &dto.ResponseUserLoginInfo{
		Role:    role,
		ID:      user["id"],
		Name:    user["name"],
		Account: user["account"],
	}, nil
}

func (s *AccountService) Logout(c context.Context, UserID string) bool {
	userKey := "drive:user:" + UserID

	user, err := s.GetUserByID(c, UserID)
	if err != nil {
		return false
	}

	s.logService.WriteLog(c, &dto.WriteLog{
		Desc:   user,
		UserID: UserID,
		Event:  enum.LogEventLogOut,
	})

	s.redis.Del(c, userKey)
	return true
}
