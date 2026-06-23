package service

import (
	grpcclient "auth/internal/transport/grpc/client"

	"common/rdb"

	"gorm.io/gorm"
)

type Service struct {
	LogService     *LogService
	UserService    *UserService
	CryptoService  *CryptoService
	AccountService *AccountService
}

func NewServer(db *gorm.DB, redis *rdb.Client, grpcClient *grpcclient.GrpcClients) *Service {
	LogService := NewLogService(db)
	CryptoService := NewCryptoService(redis)

	return &Service{
		LogService:     LogService,
		CryptoService:  CryptoService,
		UserService:    NewUserService(db, redis, CryptoService, LogService),
		AccountService: NewAccountService(db, redis, CryptoService, LogService, grpcClient),
	}
}
