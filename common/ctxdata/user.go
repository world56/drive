package ctxdata

import (
	"context"
	"strconv"
)

type User struct {
	Id   int64
	Role int8
}

func UserInfo(c context.Context) *User {
	user := &User{}

	if id, ok := c.Value("user-id").(string); ok && id != "" {
		if parsed, err := strconv.ParseInt(id, 10, 64); err == nil {
			user.Id = parsed
		}
	}

	if role, ok := c.Value("user-role").(string); ok && role != "" {
		if parsed, err := strconv.ParseInt(role, 10, 8); err == nil {
			user.Role = int8(parsed)
		}
	}

	return user
}

func UserID(c context.Context) string {
	id, _ := c.Value("user-id").(string)
	return id
}
