package service

import (
	grpcclient "auth/internal/transport/grpc/client"

	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

type Service struct {
	LogService     *LogService
	UserService    *UserService
	CryptoService  *CryptoService
	AccountService *AccountService
}

func NewService(db *gorm.DB, redis *redis.Client, grpcClient *grpcclient.GrpcClients) *Service {
	LogService := newLogService(db)
	CryptoService := newCryptoService(redis)

	return &Service{
		LogService:     LogService,
		CryptoService:  CryptoService,
		UserService:    newUserService(db, redis, CryptoService, LogService),
		AccountService: newAccountService(db, redis, CryptoService, LogService, grpcClient),
	}
}
