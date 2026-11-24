package middleware

import (
	"net/http"

	"asset/api/internal/enum"

	commonmiddleware "common/middleware"
)

type RoleGuardMiddleware struct{}

func NewRoleGuardMiddleware() *RoleGuardMiddleware {
	return &RoleGuardMiddleware{}
}

func (m *RoleGuardMiddleware) Handle(next http.HandlerFunc) http.HandlerFunc {
	return commonmiddleware.NewUserRoleMiddleware(enum.UserRoleAdmin).Handler(next)
}
