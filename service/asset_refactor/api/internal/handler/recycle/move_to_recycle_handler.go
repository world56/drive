// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package recycle

import (
	"net/http"

	"asset/api/internal/logic/recycle"
	"asset/api/internal/svc"
	"asset/api/internal/types"
	"github.com/zeromicro/go-zero/rest/httpx"
)

func MoveToRecycleHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.UpdateRecyclesReq
		if err := httpx.Parse(r, &req); err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
			return
		}

		l := recycle.NewMoveToRecycleLogic(r.Context(), svcCtx)
		err := l.MoveToRecycle(&req)
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.Ok(w)
		}
	}
}
