package request

import (
	"auth/internal/model"
	"strconv"

	"github.com/gin-gonic/gin"
)

type CurrentUserInfo struct {
	ID   string
	Role int
	Auth string
}

// 获取当前操作人员用户信息
func GetCurrentUser(c *gin.Context) *CurrentUserInfo {
	id := c.Request.Header.Get("user-id")
	role := c.Request.Header.Get("user-role")
	auth := c.Request.Header.Get("Authorization")

	Role, err := strconv.Atoi(role)
	if err != nil {
		Role = model.UserRoleReg
	}

	return &CurrentUserInfo{
		ID:   id,
		Role: Role,
		Auth: auth,
	}
}
