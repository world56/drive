package router

import (
	"asset/internal/transport/http/handler"

	"github.com/gin-gonic/gin"
)

func RegisterFileRoutes(app *gin.RouterGroup, h *handler.FileHandler) {
	route := app.Group("/file")

	{
		route.GET("/search", h.SearchFiles)
		route.GET("/folders", h.FindFolders)
		route.GET("/children", h.FindFolderResources)
		route.GET("/details", h.FindResourceDetails)
		route.POST("/mkdir", h.MkdirFolder)
		route.PUT("/update", h.UpdateResourceInfo)
		route.PUT("/move", h.UpdateResourcesLocation)
		route.DELETE("/deletes", h.DeleteResources)
	}
}
