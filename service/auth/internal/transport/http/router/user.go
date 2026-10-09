package router

import (
	"auth/internal/enum"
	"auth/internal/transport/http/handler"

	"common/http/middleware"

	"github.com/gin-gonic/gin"
)

func registerUserRoutes(api *gin.RouterGroup, h *handler.UserHandler) {
	group := api.Group("/user")
	{
		group.PUT("pwd", h.ChangePassword)
	}

	adminGroup := group.Group("")
	adminGroup.Use(middleware.RolesGuard(enum.UserRoleAdmin))
	{
		adminGroup.GET("", h.GetAllUsers)
		adminGroup.GET("list", h.GetUsers)
		adminGroup.GET("detail", h.GetUserInfo)
		adminGroup.POST("insert", h.InsertUser)
		adminGroup.PUT("update", h.UpdateUserInfo)
		adminGroup.PUT("status", h.ChangeStatus)
		adminGroup.PUT("password", h.AdminSetUserPassword)
	}
}
