package router

import (
	"stats/internal/transport/http/handler"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(app *gin.Engine, h *handler.Handler) {
	routes := app.Group("/")

	RegisterStatsRoutes(routes, h.StatsHandler)
}
