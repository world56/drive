package router

import (
	"asset/internal/transport/http/handler"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(app *gin.Engine, h *handler.Handler) {
	api := app.Group("/")

	registerResourceRoutes(api, h.ResourceHandler)
}
