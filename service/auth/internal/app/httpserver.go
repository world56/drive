package app

import (
	"auth/internal/transport/http/handler"
	"auth/internal/transport/http/router"

	"github.com/gin-gonic/gin"
)

func (a *App) RunHTTP() error {
	engine := gin.Default()

	h := handler.NewHandler(a.Service)
	router.RegisterRoutes(engine, h)

	if err := engine.Run(a.Config.HTTP_ADDR); err != nil {
		return err
	}

	return nil
}
