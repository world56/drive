package service

import (
	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

type Server struct {
	CryptoService  *CryptoService
	AccountService *AccountService
}

func NewServer(db *gorm.DB, redis *redis.Client) *Server {
	CryptoService := NewCryptoService(redis)
	return &Server{
		CryptoService:  CryptoService,
		AccountService: NewAccountService(db, redis, CryptoService),
	}
}
