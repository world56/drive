// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package account

import (
	"net/http"

	"auth/internal/logic/account"
	"auth/internal/svc"
	"auth/internal/types"
	"github.com/zeromicro/go-zero/rest/httpx"
)

func LoginHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.LoginReq
		if err := httpx.Parse(r, &req); err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
			return
		}

		l := account.NewLoginLogic(r.Context(), svcCtx)
		err := l.Login(&req)
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.Ok(w)
		}
	}
}
