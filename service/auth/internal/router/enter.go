package router

import (
	"auth/internal/handler"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(app *gin.Engine, h *handler.Handler) {
	api := app.Group("/api/")

	RegisterAccountRoutes(api, h.Account)
	RegisterCryptoRoutes(api, h.Crypto)
}
