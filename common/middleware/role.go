package middleware

import (
	"net/http"
	"slices"
	"strconv"
)

type UserRoleMiddleware struct {
	roles []int
}

func NewUserRoleMiddleware(roles ...int) *UserRoleMiddleware {
	return &UserRoleMiddleware{roles: roles}
}

func (u *UserRoleMiddleware) Handler(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		raw := r.Context().Value("user-role").(string)
		role, err := strconv.Atoi(raw)
		if raw == "" || err != nil || !slices.Contains(u.roles, role) {
			http.Error(w, "Illegal operation", http.StatusBadRequest)
			return
		}
		next(w, r)
	}
}
