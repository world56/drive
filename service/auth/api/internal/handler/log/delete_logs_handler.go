// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package log

import (
	"net/http"

	"auth/api/internal/logic/log"
	"auth/api/internal/svc"
	"github.com/zeromicro/go-zero/rest/httpx"
)

func DeleteLogsHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		l := log.NewDeleteLogsLogic(r.Context(), svcCtx)
		err := l.DeleteLogs()
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.Ok(w)
		}
	}
}
