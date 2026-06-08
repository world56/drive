package app

import (
	"github.com/gin-gonic/gin"
)

func (a *App) RunHTTP() error {
	app := gin.Default()

	if err := app.Run(a.Config.HTTP_ADDR); err != nil {
		return err
	}

	return nil
}
