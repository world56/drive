package app

import (
	"asset/internal/config"
	"asset/internal/pkg/db"
	"asset/internal/pkg/mq"
	"asset/internal/service"
	"common/databases"
	"common/idgen"
	"common/rdb"

	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

type App struct {
	DB       *gorm.DB
	RabbitMQ *mq.Client
	Redis    *redis.Client
	Config   config.Config
	Service  *service.Service
}

func New() (*App, error) {
	a := &App{
		Config: config.Load(),
	}

	err := idgen.InitSnowflake(1)
	if err != nil {
		return a, err
	}

	if a.RabbitMQ, err = mq.InitRabbitMQ(a.Config.RABBITMQ_URL); err != nil {
		return a, err
	}

	if a.Redis, err = rdb.InitRedis(a.Config.REDIS_URL); err != nil {
		return a, err
	}

	if a.DB, err = db.InitPostgresSQL(a.Config.POSTGRES_DSN); err != nil {
		return a, err
	}

	a.Service = service.NewService(a.DB, a.Redis)

	return a, nil
}

func (a *App) Close() {
	if a == nil {
		return
	}

	if a.Redis != nil {
		a.Redis.Close()
	}

	if a.RabbitMQ != nil {
		a.RabbitMQ.Close()
	}

	databases.Close(a.DB)
}
