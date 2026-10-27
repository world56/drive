package app

import (
	"common/rdb"
	"gateway/internal/config"
	"gateway/internal/middleware"
	"log/slog"
	"net/http"
	"time"

	"github.com/redis/go-redis/v9"
)

type App struct {
	Config config.Config
	Redis  *redis.Client
	log    *slog.Logger
	http   *http.Server
}

func New() (*App, error) {
	a := &App{
		Config: config.Load(),
	}

	a.log = middleware.NewLogger(a.Config.IsLocal())
	slog.SetDefault(a.log)

	var err error
	if a.Redis, err = rdb.InitRedis(a.Config.REDIS_URL); err != nil {
		return a, err
	}

	handler, err := a.buildHandler()
	if err != nil {
		return a, err
	}

	a.http = &http.Server{
		Addr:              a.Config.HTTP_ADDR,
		Handler:           handler,
		ReadHeaderTimeout: 10 * time.Second,
		IdleTimeout:       120 * time.Second,
	}

	return a, nil
}

func (a *App) Close() {
	if a == nil {
		return
	}

	if a.http != nil {
		_ = a.http.Close()
	}

	if a.Redis != nil {
		_ = a.Redis.Close()
	}
}
