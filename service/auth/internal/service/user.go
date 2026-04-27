package service

import (
	"auth/internal/dto"
	"auth/internal/model"
	"context"
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

	var users []dto.User
	if err := db.
		Select("id", "name", "account", "status", "role", "remark", "contact").
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

func (s *UserService) GetAllUsers(context context.Context) ([]dto.User, error) {
	var users []dto.User
	if err := s.db.WithContext(context).
		Select("id", "name").
		Find(&users).
		Error; err != nil {
		return nil, err
	}
	return users, nil
}

func (s *UserService) GetUserInfo(query dto.RequestFindStringPrimaryKey) (*model.User, error) {
	var user model.User
	if err := s.db.
		Where("id = ? AND status = ?", query.Id, model.UserStatusActive).
		First(&user).
		Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (s *UserService) InsertUser(body dto.RequestCreateUserDTO) (bool, error) {
	if err := s.db.Where("account = ?", body.Account).First(&model.User{}).Error; err == nil {
		return false, errors.New("Account already exists")
	}

	passwordHash, err := s.cryptoService.HashPassword(body.Password)
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
	}).Error; err != nil {
		return false, err
	}
	return true, nil
}

func (s *UserService) UpdateUserInfo(c context.Context, body dto.RequestUpdateUser) (bool, error) {
	db := s.db.WithContext(c)

	if err := db.Where("id = ?", body.Id).First(&model.User{}).Error; err != nil {
		return false, errors.New("User not found")
	}

	if err := db.Model(&model.User{}).
		Where("id = ?", body.Id).
		Updates(map[string]interface{}{
			"name":    body.Name,
			"remark":  body.Remark,
			"contact": body.Contact,
		}).Error; err != nil {
		return false, err
	}
	return true, nil
}

func (s *UserService) ChangeStatus(context context.Context, body dto.RequestFindStringPrimaryKey) (bool, error) {
	db := s.db.WithContext(context)
	var user model.User
	if err := db.Select("id", "status").
		Where("id = ?", body.Id).
		First(&user).Error; err != nil {
		return false, errors.New("User not found")
	}
	var status int
	if user.Status == model.UserStatusFreeze {
		status = model.UserStatusActive
	} else {
		status = model.UserStatusFreeze
	}
	if err := db.Where("id = ?", body.Id).Update("status", status).Error; err != nil {
		return false, err
	}
	return true, nil
}

func (s *UserService) ChangePassword(context context.Context, body dto.RequestUpdatePassword) (bool, error) {
	db := s.db.WithContext(context)
	var user model.User
	if err := db.Select("password").
		Where("id = ?", body.Id).
		First(&user).Error; err != nil {
		return false, errors.New("Not a valid user")
	}

	valid, err := s.cryptoService.VerifyPassword(body.Pwd, user.Password)
	if err != nil {
		return false, err
	}
	if !valid {
		return false, errors.New("Old password is incorrect")
	}

	pwd, err := s.cryptoService.HashPassword(body.Password)
	if err != nil {
		return false, err
	}
	if err := db.Model(&user).
		Where("id = ?", body.Id).
		Update("password", pwd).
		Error; err != nil {
		return false, err
	}

	return true, nil
}
