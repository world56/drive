package router

import (
	"asset/internal/transport/http/handler"

	"github.com/gin-gonic/gin"
)

func registerResourceRoutes(app *gin.RouterGroup, h *handler.ResourceHandler) {
	route := app.Group("/resource")

	{
		route.GET("/search", h.SearchFiles)
		route.GET("/list", h.FindResources)
		route.GET("/folders", h.FindFolders)
		route.GET("/:id", h.FindResourceDetails)
		route.POST("/mkdir", h.MkdirFolder)
		route.PUT("/update", h.UpdateResourceInfo)
		route.PUT("/move", h.UpdateResourcesLocation)
		route.DELETE("/deletes", h.DeleteResources)
	}
}
