package router

import (
	"auth/internal/handler"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(app *gin.Engine, h *handler.Handler) {
	api := app.Group("/")

	RegisterUserRoutes(api, h.UserHandler)
	RegisterCryptoRoutes(api, h.CryptoHandler)
	RegisterAccountRoutes(api, h.AccountHandler)
}
