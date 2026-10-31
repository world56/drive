package router

import (
	"asset/internal/transport/http/handler"

	"github.com/gin-gonic/gin"
)

func registerRecycleRoutes(app *gin.RouterGroup, h *handler.RecycleHandler) {
	route := app.Group("/recycle")

	{
		route.GET("", h.FindRecycles)
		route.DELETE("", h.MoveToRecycleBin)
	}
}
