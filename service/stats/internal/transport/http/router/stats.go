package router

import (
	"stats/internal/transport/http/handler"

	"github.com/gin-gonic/gin"
)

func RegisterStatsRoutes(api *gin.RouterGroup, h *handler.StatsHandler) {
	route := api.Group("")

	{
		route.GET("/storage", h.GetStorage)
		route.GET("/access", h.GetAccess)
		route.GET("/hot", h.GetHot)
		route.PUT("/hot", h.UpdateHot)
		route.GET("/recently", h.GetRecently)
		route.GET("/favorite", h.GetFavorite)
	}
}
