package middleware

import (
	"auth/internal/pkg/request"
	"auth/internal/pkg/response"
	"errors"

	"github.com/gin-gonic/gin"
)

// 角色权限中间件
func RolesGurd(allowedRoles ...int) gin.HandlerFunc {
	return func(c *gin.Context) {
		currentUser := request.GetUserInfo(c)
		for _, role := range allowedRoles {
			if currentUser.Role == role {
				return
			}
		}
		response.ClientError(c, errors.New("Illegal operation"))
		c.Abort()
		return
	}
}
