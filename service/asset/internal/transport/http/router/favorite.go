package router

import (
	"asset/internal/transport/http/handler"

	"github.com/gin-gonic/gin"
)

func registerFavoriteRoutes(app *gin.RouterGroup, h *handler.FavoriteHandler) {
	route := app.Group("favorite")

	{
		route.GET("list", h.FindFavorites)
		route.POST("insert", h.InsertFavorite)
		route.DELETE("remove", h.RemoveFavorite)
	}
}
