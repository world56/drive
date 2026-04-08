package service

import (
	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

type Server struct {
	Crypto  *CryptoService
	Account *AccountService
}

func NewServer(db *gorm.DB, redis *redis.Client) *Server {
	return &Server{
		Crypto:  NewAuthService(redis),
		Account: NewAccountService(db),
	}
}
