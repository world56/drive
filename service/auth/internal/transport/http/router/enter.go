package router

import (
	"auth/internal/transport/http/handler"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(app *gin.Engine, h *handler.Handler) {
	api := app.Group("/")

	RegisterUserRoutes(api, h.UserHandler)
	RegisterCryptoRoutes(api, h.CryptoHandler)
	RegisterAccountRoutes(api, h.AccountHandler)
	RegisterLogRoutes(api, h.LogHandler)
}
