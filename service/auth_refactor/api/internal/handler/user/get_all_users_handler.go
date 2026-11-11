// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package user

import (
	"net/http"

	"auth/api/internal/logic/user"
	"auth/api/internal/svc"
	"github.com/zeromicro/go-zero/rest/httpx"
)

func GetAllUsersHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		l := user.NewGetAllUsersLogic(r.Context(), svcCtx)
		resp, err := l.GetAllUsers()
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.OkJsonCtx(r.Context(), w, resp)
		}
	}
}
