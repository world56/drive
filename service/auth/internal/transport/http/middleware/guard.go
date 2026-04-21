package middleware

import (
	"auth/internal/pkg/request"
	"auth/internal/pkg/response"
	"errors"
	"slices"

	"github.com/gin-gonic/gin"
)

// 角色权限中间件
func RolesGuard(allowedRoles ...int) gin.HandlerFunc {
	return func(c *gin.Context) {
		currentUser := request.GetUserInfo(c)
		if slices.Contains(allowedRoles, currentUser.Role) {
			return
		}
		response.ClientError(c, errors.New("Illegal operation"))
		c.Abort()
	}
}
