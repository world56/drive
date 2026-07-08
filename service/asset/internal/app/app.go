package app

import (
	"asset/internal/config"
	"asset/internal/pkg/db"
	"asset/internal/service"
	"common/idgen"
	"common/rdb"

	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

type App struct {
	DB      *gorm.DB
	Redis   *redis.Client
	Config  config.Config
	Service *service.Service
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

	svc := service.NewService(db, redis)

	return &App{
		DB:      db,
		Config:  cfg,
		Redis:   redis,
		Service: svc,
	}, nil
}
