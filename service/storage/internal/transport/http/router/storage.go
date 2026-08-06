package router

import (
	"storage/internal/transport/http/handler"

	"github.com/gin-gonic/gin"
)

func RegisterStorageRoutes(api *gin.RouterGroup, h *handler.StorageHandler) {
	group := api.Group("")

	{
		group.POST("upload", h.Write)
		group.GET("/:ObjectName", h.Read)
	}
}
