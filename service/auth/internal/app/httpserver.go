package app

import (
	"auth/internal/config"
	"auth/internal/pkg/databases"
	"auth/internal/service"
	"auth/internal/transport/http/handler"
	"auth/internal/transport/http/router"

	"github.com/gin-gonic/gin"
)

func RunHTTP() error {
	cfg := config.Load()
	engine := gin.Default()

	db, sqlDBerr := databases.InitPostgresSQL(cfg.PostgresDSN)
	if sqlDBerr != nil {
		return sqlDBerr
	}

	redis, rDBerr := databases.InitReds(cfg.RedisURL)
	if rDBerr != nil {
		return rDBerr
	}

	svc := service.NewServer(db, redis)
	h := handler.NewHandler(svc)

	router.RegisterRoutes(engine, h)

	if err := engine.Run(cfg.HTTPAddr); err != nil {
		return err
	}

	return nil
}
