package app

import (
	"auth/internal/config"
	"auth/internal/pkg/databases"
	"auth/internal/service"
	grpcclient "auth/internal/transport/grpc/client"
	"common/rdb"

	"gorm.io/gorm"
)

type App struct {
	Config     config.Config
	DB         *gorm.DB
	Redis      *rdb.Client
	Service    *service.Service
	GrpcClient *grpcclient.GrpcClients
}

func New() (*App, error) {
	cfg := config.Load()

	db, err := databases.InitPostgresSQL(cfg.POSTGRES_DSN)
	if err != nil {
		return nil, err
	}

	redis, err := rdb.Initialize(cfg.REDIS_URL)
	if err != nil {
		return nil, err
	}

	grpcClient, err := grpcclient.NewGrpcClients(cfg.GRPC_STATS_ADDR)
	if err != nil {
		return nil, err
	}

	svc := service.NewServer(db, redis, grpcClient)

	return &App{
		Config:     cfg,
		DB:         db,
		Redis:      redis,
		Service:    svc,
		GrpcClient: grpcClient,
	}, nil
}
