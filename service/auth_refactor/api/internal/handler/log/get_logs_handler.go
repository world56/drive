// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package log

import (
	"net/http"

	"auth/api/internal/logic/log"
	"auth/api/internal/svc"
	"auth/api/internal/types"
	"github.com/zeromicro/go-zero/rest/httpx"
)

func GetLogsHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.LogsReq
		if err := httpx.Parse(r, &req); err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
			return
		}

		l := log.NewGetLogsLogic(r.Context(), svcCtx)
		resp, err := l.GetLogs(&req)
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.OkJsonCtx(r.Context(), w, resp)
		}
	}
}
