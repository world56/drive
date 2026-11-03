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
	logService := newLogService(db)
	cryptoService := newCryptoService(redis)

	return &Service{
		LogService:     logService,
		CryptoService:  cryptoService,
		UserService:    newUserService(db, redis, cryptoService, logService),
		AccountService: newAccountService(db, redis, cryptoService, logService, grpcClient),
	}
}
