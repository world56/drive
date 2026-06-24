package app

import (
	"auth/internal/config"
	"auth/internal/pkg/db"
	"auth/internal/service"
	grpcclient "auth/internal/transport/grpc/client"
	"common/idgen"
	"common/rdb"

	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

type App struct {
	Config     config.Config
	DB         *gorm.DB
	Redis      *redis.Client
	Service    *service.Service
	GrpcClient *grpcclient.GrpcClients
}

func New() (*App, error) {
	cfg := config.Load()

	err := idgen.InitSnowflake(1)
	if err != nil {
		return nil, err
	}

	redis, err := rdb.InitRedis(cfg.REDIS_URL)
	if err != nil {
		return nil, err
	}

	db, err := db.InitPostgresSQL(cfg.POSTGRES_DSN)
	if err != nil {
		return nil, err
	}

	grpcClient, err := grpcclient.NewGrpcClients(cfg.GRPC_STATS_ADDR)
	if err != nil {
		return nil, err
	}

	svc := service.NewService(db, redis, grpcClient)

	return &App{
		Config:     cfg,
		DB:         db,
		Redis:      redis,
		Service:    svc,
		GrpcClient: grpcClient,
	}, nil
}
