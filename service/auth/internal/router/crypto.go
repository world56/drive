package router

import (
	"auth/internal/handler"

	"github.com/gin-gonic/gin"
)

func RegisterCryptoRoutes(api *gin.RouterGroup, h *handler.CryptoHandler) {
	route := api.Group("/crypto")

	{
		route.GET("key", h.GetSecret)
	}
}
