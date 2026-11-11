// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package account

import (
	"net/http"

	"auth/internal/logic/account"
	"auth/internal/svc"
	"github.com/zeromicro/go-zero/rest/httpx"
)

func GetUserLoginInfoHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		l := account.NewGetUserLoginInfoLogic(r.Context(), svcCtx)
		resp, err := l.GetUserLoginInfo()
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.OkJsonCtx(r.Context(), w, resp)
		}
	}
}
