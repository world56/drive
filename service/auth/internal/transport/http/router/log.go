package router

import (
	"auth/internal/transport/http/handler"

	"github.com/gin-gonic/gin"
)

func registerLogRoutes(api *gin.RouterGroup, h *handler.LogHandler) {
	route := api.Group("/log")

	{
		route.GET("", h.GetLogs)
	}
}
