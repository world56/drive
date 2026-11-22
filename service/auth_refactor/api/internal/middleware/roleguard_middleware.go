// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package middleware

import (
	"auth/api/internal/enum"
	"net/http"

	commonmiddleware "common/middleware"
)

type RoleGuardMiddleware struct{}

func NewRoleGuardMiddleware() *RoleGuardMiddleware {
	return &RoleGuardMiddleware{}
}

func (m *RoleGuardMiddleware) Handle(next http.HandlerFunc) http.HandlerFunc {
	return commonmiddleware.NewUserRoleMiddleware(enum.UserRoleAdmin).Handler(next)
}
