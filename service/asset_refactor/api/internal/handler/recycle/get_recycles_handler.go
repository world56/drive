// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package recycle

import (
	"net/http"

	"asset/api/internal/logic/recycle"
	"asset/api/internal/svc"

	"github.com/zeromicro/go-zero/rest/httpx"
)

func GetRecyclesHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		l := recycle.NewGetRecyclesLogic(r.Context(), svcCtx)
		resp, err := l.GetRecycles()
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.OkJsonCtx(r.Context(), w, resp)
		}
	}
}
