// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package resource

import (
	"net/http"

	"asset/api/internal/logic/resource"
	"asset/api/internal/svc"
	"asset/api/internal/types"
	"github.com/zeromicro/go-zero/rest/httpx"
)

func SearchAllResourcesHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.SearchAllResourcesReq
		if err := httpx.Parse(r, &req); err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
			return
		}

		l := resource.NewSearchAllResourcesLogic(r.Context(), svcCtx)
		resp, err := l.SearchAllResources(&req)
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.OkJsonCtx(r.Context(), w, resp)
		}
	}
}
