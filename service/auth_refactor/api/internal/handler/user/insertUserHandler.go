// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package user

import (
	"net/http"

	"auth/internal/logic/user"
	"auth/internal/svc"
	"auth/internal/types"
	"github.com/zeromicro/go-zero/rest/httpx"
)

func InsertUserHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.UserInsertReq
		if err := httpx.Parse(r, &req); err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
			return
		}

		l := user.NewInsertUserLogic(r.Context(), svcCtx)
		err := l.InsertUser(&req)
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.Ok(w)
		}
	}
}
