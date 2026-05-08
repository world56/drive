package service

import (
	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

type Server struct {
	LogService     *LogService
	UserService    *UserService
	CryptoService  *CryptoService
	AccountService *AccountService
}

func NewServer(db *gorm.DB, redis *redis.Client) *Server {
	CryptoService := NewCryptoService(redis)
	return &Server{
		CryptoService:  CryptoService,
		LogService:     NewLogService(db),
		UserService:    NewUserService(db, CryptoService),
		AccountService: NewAccountService(db, redis, CryptoService),
	}
}
