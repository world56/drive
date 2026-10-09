package router

import (
	"auth/internal/transport/http/handler"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(app *gin.Engine, h *handler.Handler) {
	api := app.Group("/")

	registerUserRoutes(api, h.UserHandler)
	registerCryptoRoutes(api, h.CryptoHandler)
	registerAccountRoutes(api, h.AccountHandler)
	registerLogRoutes(api, h.LogHandler)
}
