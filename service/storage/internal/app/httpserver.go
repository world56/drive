package app

import (
	"storage/internal/transport/http/handler"
	"storage/internal/transport/http/router"

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
