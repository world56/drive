package router

import (
	"storage/internal/transport/http/handler"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(app *gin.Engine, h *handler.Handler) {
	api := app.Group("/")

	RegisterStorageRoutes(api, h.StorageHandler)
}
