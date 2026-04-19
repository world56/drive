package service

import (
	"auth/internal/dto"
	"auth/internal/model"
	"context"
	"crypto/md5"
	"encoding/hex"
	"errors"

	"gorm.io/gorm"
)

type UserService struct {
	db            *gorm.DB
	cryptoService *CryptoService
}

func NewUserService(db *gorm.DB, c *CryptoService) *UserService {
	return &UserService{
		db:            db,
		cryptoService: c,
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
	if err := db.Select("id", "name", "account", "status", "role", "remark", "contact").Offset(offset).Limit(query.PageSize).Find(&users).Error; err != nil {
		return nil, err
	}

	return &dto.ResponseFindUsersDTO{
		Users: users,
		Count: int(count),
	}, nil
}

func (s *UserService) GetAllUsers(context context.Context) ([]model.User, error) {
	var users []model.User
	if err := s.db.WithContext(context).Select("id", "name").Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

func (s *UserService) GetUserInfo(query dto.RequestFindStringPrimaryKey) (*model.User, error) {
	var user model.User
	if err := s.db.Where("id = ? AND status = ?", query.Id, model.UserStatusActive).Find(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (s *UserService) InsertUser(body dto.RequestCreateUserDTO) (bool, error) {
	if err := s.db.Where("account = ?", body.Account).First(&model.User{}).Error; err == nil {
		return false, errors.New("Account already exists")
	}
	if err := s.db.Create(&model.User{
		Name:     body.Name,
		Account:  body.Account,
		Password: body.Password,
		Remark:   body.Remark,
		Contact:  body.Contact,
		Status:   model.UserStatusActive,
	}).Error; err != nil {
		return false, err
	}
	return true, nil
}

func (s *UserService) UpdateUserInfo(body dto.RequestUpdateUser) (bool, error) {
	if err := s.db.Where("id = ?", body.Id).First(&model.User{}).Error; err != nil {
		return false, errors.New("User not found")
	}

	if err := s.db.Model(&model.User{}).Where("id = ?", body.Id).Updates(map[string]interface{}{
		"name":    body.Name,
		"remark":  body.Remark,
		"contact": body.Contact,
	}).Error; err != nil {
		return false, err
	}
	return true, nil
}

func (s *UserService) ChangeStatus(query dto.RequestFindStringPrimaryKey) (bool, error) {
	var user model.User
	if err := s.db.Select("id", "status").Where("id = ?", query.Id).First(&user).Error; err != nil {
		return false, errors.New("User not found")
	}
	var status int
	if user.Status == model.UserStatusFreeze {
		status = model.UserStatusActive
	} else {
		status = model.UserStatusFreeze
	}
	if err := s.db.Where("id = ?", query.Id).Update("status", status).Error; err != nil {
		return false, err
	}
	return true, nil
}

func (s *UserService) ChangePassword(context context.Context, body dto.RequestUpdatePassword) (bool, error) {
	var user model.User
	if err := s.db.Select("password").Where("id = ?", body.Id).First(&user).Error; err != nil {
		return false, errors.New("Not a valid user")
	}
	if user.Password != body.Pwd {
		return false, errors.New("Old password is incorrect")
	}

	bytes := md5.Sum([]byte(body.Password))
	pwd := hex.EncodeToString(bytes[:])
	if err := s.db.Model(&user).Where("id = ?", body.Id).Update("password", pwd).Error; err != nil {
		return false, err
	}

	return true, nil
}
