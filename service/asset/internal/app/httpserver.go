package app

import (
	"asset/internal/transport/http/handler"
	"asset/internal/transport/http/router"

	"github.com/gin-gonic/gin"
)

func (a *App) RunHTTP() error {
	app := gin.Default()

	h := handler.NewHandler(a.Service)
	router.RegisterRoutes(app, h)

	if err := app.Run(a.Config.HTTP_ADDR); err != nil {
		return err
	}

	return nil
}
