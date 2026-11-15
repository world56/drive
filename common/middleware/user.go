package middleware

import (
	"context"
	"net/http"
)

type UserAgentMiddleware struct{}

func NewUserAgentMiddleware() *UserAgentMiddleware {
	return &UserAgentMiddleware{}
}

func (m *UserAgentMiddleware) Handler(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		c := r.Context()
		c = context.WithValue(c, "user-id", r.Header.Get("user-id"))
		c = context.WithValue(c, "user-role", r.Header.Get("user-role"))
		next(w, r.WithContext(c))
	}
}
