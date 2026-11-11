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

func GetUsersHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.UsersReq
		if err := httpx.Parse(r, &req); err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
			return
		}

		l := user.NewGetUsersLogic(r.Context(), svcCtx)
		resp, err := l.GetUsers(&req)
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.OkJsonCtx(r.Context(), w, resp)
		}
	}
}
