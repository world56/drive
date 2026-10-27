package middleware

import (
	"encoding/json"
	"gateway/internal/pkg/utils"
	"net/http"
	"slices"

	"github.com/redis/go-redis/v9"
)

// 网关鉴权
type Auth struct {
	redis  *redis.Client
	secret []byte
}

func NewAuth(redis *redis.Client, secret string) *Auth {
	return &Auth{
		redis:  redis,
		secret: []byte(secret),
	}
}

func (a *Auth) Handle(whitelist []string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if slices.Contains(whitelist, r.URL.Path) {
				next.ServeHTTP(w, r)
				return
			}

			cookie, err := r.Cookie("Authorization")
			if err != nil || cookie.Value == "" {
				writeJSON(w, 403, "User not logged in")
				return
			}

			claims, err := utils.ParseJWT(cookie.Value, a.secret)
			if err != nil {
				writeJSON(w, 502, err.Error())
				return
			}

			user, err := a.redis.HGetAll(r.Context(), "drive:user:"+claims.UserID).Result()
			if err != nil {
				writeJSON(w, 502, err.Error())
				return
			}

			if user["id"] == "" {
				writeJSON(w, 401, "User login timeout")
				return
			}

			r.Header.Set("user-id", user["id"])
			r.Header.Set("user-role", user["role"])
			next.ServeHTTP(w, r)
		})
	}
}

func writeJSON(w http.ResponseWriter, code int, msg string) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"code":    code,
		"message": msg,
		"content": nil,
	})
}
