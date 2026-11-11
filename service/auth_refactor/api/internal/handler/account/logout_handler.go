// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package account

import (
	"net/http"

	"auth/api/internal/logic/account"
	"auth/api/internal/svc"
	"auth/api/internal/types"

	"github.com/zeromicro/go-zero/rest/httpx"
)

func LogoutHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.UserLogoutReq
		if err := httpx.Parse(r, &req); err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
			return
		}

		l := account.NewLogoutLogic(r.Context(), svcCtx)
		err := l.Logout(&req)
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			http.SetCookie(w, &http.Cookie{
				Name:     "Authorization",
				Value:    "",
				Path:     "/",
				MaxAge:   -1,
				SameSite: http.SameSiteLaxMode,
			})
			httpx.Ok(w)
		}
	}
}
