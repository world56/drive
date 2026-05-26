package app

import (
	"stats/internal/config"
	databases "stats/internal/db"
	"stats/internal/service"

	"github.com/redis/go-redis/v9"
)

type App struct {
	Config  config.Config
	Redis   *redis.Client
	Service *service.Service
}

func New() (*App, error) {
	cfg := config.Load()

	redis, err := databases.InitRedis(cfg.REDIS_URL)
	if err != nil {
		return nil, err
	}

	svc := service.NewService(redis)

	return &App{
		Config:  cfg,
		Redis:   redis,
		Service: svc,
	}, nil
}
