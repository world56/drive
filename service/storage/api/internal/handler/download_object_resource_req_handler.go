// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package handler

import (
	"net/http"

	"storage/api/internal/logic"
	"storage/api/internal/svc"
	"storage/api/internal/types"

	"github.com/zeromicro/go-zero/rest/httpx"
)

func DownloadObjectResourceReqHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.DownloadObjectResourceReq
		if err := httpx.Parse(r, &req); err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
			return
		}

		l := logic.NewDownloadObjectResourceReqLogic(r.Context(), svcCtx)
		if err := l.DownloadObjectResourceReq(w, r, &req); err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		}
	}
}
