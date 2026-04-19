package service

import (
	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

type Server struct {
	UserService    *UserService
	CryptoService  *CryptoService
	AccountService *AccountService
}

func NewServer(db *gorm.DB, redis *redis.Client) *Server {
	CryptoService := NewCryptoService(redis)
	return &Server{
		CryptoService:  CryptoService,
		UserService:    NewUserService(db, CryptoService),
		AccountService: NewAccountService(db, redis, CryptoService),
	}
}
