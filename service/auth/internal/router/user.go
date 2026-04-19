package router

import (
	"auth/internal/handler"
	"auth/internal/middleware"
	"auth/internal/model"

	"github.com/gin-gonic/gin"
)

func RegisterUserRoutes(api *gin.RouterGroup, h *handler.UserHandler) {
	group := api.Group("/user")
	{
		group.PUT("pwd", h.ChangePassword)
	}

	adminGroup := group.Group("")
	adminGroup.Use(middleware.RolesGurd(model.UserRoleAdmin))
	{
		adminGroup.GET("", h.GetAllUsers)
		adminGroup.GET("list", h.GetUsers)
		adminGroup.GET("detail", h.GetUserInfo)
		adminGroup.POST("insert", h.InsertUser)
		adminGroup.PUT("update", h.UpdateUserInfo)
		adminGroup.PUT("status", h.ChangeStatus)
	}
}
