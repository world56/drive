package router

import (
	"auth/internal/transport/http/handler"

	"github.com/gin-gonic/gin"
)

func registerCryptoRoutes(api *gin.RouterGroup, h *handler.CryptoHandler) {
	route := api.Group("/crypto")

	{
		route.GET("", h.GetSecret)
	}
}
