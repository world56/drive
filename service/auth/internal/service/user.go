package service

import (
	"auth/internal/dto"
	"auth/internal/model"
	"context"
	"encoding/json"
	"errors"

	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

type UserService struct {
	db            *gorm.DB
	redis         *redis.Client
	cryptoService *CryptoService
}

func NewUserService(db *gorm.DB, redis *redis.Client, c *CryptoService) *UserService {
	return &UserService{
		db:            db,
		redis:         redis,
		cryptoService: c,
	}
}

func (s *UserService) FindUsers(c context.Context, query dto.RequestFindUsersQuery) (*dto.ResponseFindUsersDTO, error) {
	db := s.db.WithContext(c).Model(&model.User{})

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

	var users []dto.User
	if err := db.
		Select("id", "name", "account", "status", "role", "remark", "contact").
		Where("role = ?", model.UserRoleReg).
		Offset((query.CurrentPage - 1) * query.PageSize).
		Limit(query.PageSize).
		Find(&users).Error; err != nil {
		return nil, err
	}

	return &dto.ResponseFindUsersDTO{
		List:  users,
		Count: count,
	}, nil
}

func (s *UserService) GetAllUsers(context context.Context) ([]dto.ResponseFindUsersMap, error) {
	var users []dto.ResponseFindUsersMap
	if err := s.db.WithContext(context).
		Model(&model.User{}).
		Select("id", "name").
		Find(&users).
		Error; err != nil {
		return nil, err
	}
	return users, nil
}

func (s *UserService) GetUserInfo(c context.Context, query dto.RequestFindStringPrimaryKey) (*dto.User, error) {
	var user dto.User
	if err := s.db.
		WithContext(c).
		Model(&model.User{}).
		Select("id", "name", "role", "status", "account", "remark", "contact", "createTime").
		Where("id = ?", query.ID).
		First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (s *UserService) InsertUser(c context.Context, body dto.RequestCreateUserDTO) (bool, error) {
	if err := s.db.
		WithContext(c).
		Where("account = ?", body.Account).
		First(&model.User{}).
		Error; err == nil {
		return false, errors.New("Account already exists")
	}

	text, err := s.cryptoService.Decrypt(c, body.Password)
	if err != nil {
		return false, errors.New("Parse failed")
	}

	var password string
	if err := json.Unmarshal(text, &password); err != nil {
		return false, err
	}

	passwordHash, err := s.cryptoService.HashPassword(password)
	if err != nil {
		return false, err
	}

	if err := s.db.Create(&model.User{
		Name:     body.Name,
		Account:  body.Account,
		Remark:   body.Remark,
		Contact:  body.Contact,
		Status:   model.UserStatusActive,
		Password: passwordHash,
		Role:     model.UserRoleReg,
	}).Error; err != nil {
		return false, err
	}
	return true, nil
}

func (s *UserService) UpdateUser(c context.Context, body dto.RequestUpdateUser) (bool, error) {
	db := s.db.WithContext(c)

	if err := db.Where("id = ?", body.ID).First(&model.User{}).Error; err != nil {
		return false, errors.New("User not found")
	}

	if err := db.Model(&model.User{}).
		Where("id = ?", body.ID).
		Updates(map[string]interface{}{
			"name":    body.Name,
			"remark":  body.Remark,
			"contact": body.Contact,
		}).Error; err != nil {
		return false, err
	}
	return true, nil
}

func (s *UserService) ChangeStatus(c context.Context, body dto.RequestFindStringPrimaryKey) (bool, error) {
	db := s.db.WithContext(c)

	var user model.User
	if err := db.Select("id", "status").
		Where("id = ?", body.ID).
		First(&user).Error; err != nil {
		return false, errors.New("User not found")
	}

	var status int
	if user.Status == model.UserStatusFreeze {
		status = model.UserStatusActive
	} else {
		status = model.UserStatusFreeze
	}

	if err := db.
		Model(&user).
		Where("id = ?", body.ID).
		Update("status", status).Error; err != nil {
		return false, err
	}

	s.redis.Del(c, "user:"+body.ID) // 被冻结立即踢下线

	return true, nil
}

func (s *UserService) ChangePassword(c context.Context, token []byte) (bool, error) {
	body, err := s.cryptoService.Decrypt(c, string(token))
	if err != nil {
		return false, err
	}

	var userPwd dto.RequestUpdatePassword
	if err := json.Unmarshal(body, &userPwd); err != nil {
		return false, err
	}

	db := s.db.WithContext(c)
	var user model.User
	if err := db.Select("password").
		Where("id = ?", userPwd.ID).
		First(&user).Error; err != nil {
		return false, errors.New("Not a valid user")
	}

	valid, err := s.cryptoService.VerifyPassword(userPwd.Pwd, user.Password)
	if err != nil {
		return false, err
	}
	if !valid {
		return false, errors.New("Old password is incorrect")
	}

	pwd, err := s.cryptoService.HashPassword(userPwd.Password)
	if err != nil {
		return false, err
	}
	if err := db.Model(&user).
		Where("id = ?", userPwd.ID).
		Update("password", pwd).
		Error; err != nil {
		return false, err
	}

	return true, nil
}

func (s *UserService) AdminSetUserPassword(c context.Context, token []byte) (bool, error) {
	body, err := s.cryptoService.Decrypt(c, string(token))
	if err != nil {
		return false, err
	}

	var userPwd dto.RequestAdminSetUserPassword
	if err := json.Unmarshal(body, &userPwd); err != nil {
		return false, err
	}

	db := s.db.WithContext(c)
	var user model.User
	if err := db.Select("id").
		Where("id = ?", userPwd.Id).
		First(&user).Error; err != nil {
		return false, errors.New("Not a valid user")
	}

	pwd, err := s.cryptoService.HashPassword(userPwd.Password)
	if err != nil {
		return false, err
	}

	if err := db.Model(&user).
		Where("id = ?", userPwd.Id).
		Update("password", pwd).
		Error; err != nil {
		return false, err
	}

	return true, nil
}
