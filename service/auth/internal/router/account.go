package router

import (
	"auth/internal/handler"

	"github.com/gin-gonic/gin"
)

func RegisterAccountRoutes(app *gin.RouterGroup, h *handler.AccountHandler) {
	route := app.Group("/account")

	{
		route.GET("has", h.HasSuperAdmin)
	}

}
