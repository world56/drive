// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package account

import (
	"net/http"

	"auth/internal/logic/account"
	"auth/internal/svc"
	"github.com/zeromicro/go-zero/rest/httpx"
)

func HasSuperAdminHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		l := account.NewHasSuperAdminLogic(r.Context(), svcCtx)
		resp, err := l.HasSuperAdmin()
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.OkJsonCtx(r.Context(), w, resp)
		}
	}
}
