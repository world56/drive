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

func GetUserLoginInfoHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.UserLoginInfoReq
		if err := httpx.Parse(r, &req); err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
			return
		}

		l := account.NewGetUserLoginInfoLogic(r.Context(), svcCtx)
		resp, err := l.GetUserLoginInfo(&req)
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.OkJsonCtx(r.Context(), w, resp)
		}
	}
}
