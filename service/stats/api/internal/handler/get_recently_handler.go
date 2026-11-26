// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package handler

import (
	"net/http"

	"github.com/zeromicro/go-zero/rest/httpx"
	"stats/api/internal/logic"
	"stats/api/internal/svc"
)

func GetRecentlyHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		l := logic.NewGetRecentlyLogic(r.Context(), svcCtx)
		resp, err := l.GetRecently()
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.OkJsonCtx(r.Context(), w, resp)
		}
	}
}
