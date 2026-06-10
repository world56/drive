package request

import (
	"strconv"

	"github.com/gin-gonic/gin"
)

var UserRoleRegularUser = 1 // 普通用户

type CurrentUserInfo struct {
	ID   string
	Role int
}

// 获取当前操作人员用户信息
func GetCurrentUser(c *gin.Context) *CurrentUserInfo {
	id := c.Request.Header.Get("user-id")
	role := c.Request.Header.Get("user-role")

	Role, err := strconv.Atoi(role)
	if err != nil {
		Role = UserRoleRegularUser
	}

	return &CurrentUserInfo{
		ID:   id,
		Role: Role,
	}
}
