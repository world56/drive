package app

import (
	"asset/internal/config"
	"asset/internal/pkg/databases"
	"asset/internal/pkg/idgen"

	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

type App struct {
	DB     *gorm.DB
	Redis  *redis.Client
	Config config.Config
}

func New() (*App, error) {
	cfg := config.Load()

	err := idgen.InitSnowflake(1)
	if err != nil {
		return nil, err
	}

	db, err := databases.InitRelationalDB(cfg.POSTGRES_DSN)
	if err != nil {
		return nil, err
	}

	redis, err := databases.InitRedis(cfg.POSTGRES_DSN)
	if err != nil {
		return nil, err
	}

	return &App{
		DB:     db,
		Config: cfg,
		Redis:  redis,
	}, nil
}
