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
	LogService := NewLogService(db)
	CryptoService := NewCryptoService(redis)

	return &Server{
		LogService:     LogService,
		CryptoService:  CryptoService,
		UserService:    NewUserService(db, redis, CryptoService, LogService),
		AccountService: NewAccountService(db, redis, CryptoService, LogService),
	}
}
