package ctxdata

import (
	"context"
	"strconv"
)

type User struct {
	Id   string
	Role int8
}

func UserInfo(c context.Context) *User {
	user := &User{}

	if id, ok := c.Value("user-id").(string); ok {
		user.Id = id
	}

	if role, ok := c.Value("user-role").(string); ok && role != "" {
		if _role, err := strconv.ParseInt(role, 10, 8); err == nil {
			user.Role = int8(_role)
		}
	}

	return user
}
