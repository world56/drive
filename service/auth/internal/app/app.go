package app

import (
	"auth/internal/config"
	"auth/internal/pkg/databases"
	"auth/internal/service"

	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

type App struct {
	Config  config.Config
	DB      *gorm.DB
	Redis   *redis.Client
	Service *service.Server
}

func New() (*App, error) {
	cfg := config.Load()

	db, err := databases.InitPostgresSQL(cfg.POSTGRES_DSN)
	if err != nil {
		return nil, err
	}

	redis, err := databases.InitReds(cfg.REDIS_URL)
	if err != nil {
		return nil, err
	}

	svc := service.NewServer(db, redis)

	return &App{
		Config:  cfg,
		DB:      db,
		Redis:   redis,
		Service: svc,
	}, nil
}
