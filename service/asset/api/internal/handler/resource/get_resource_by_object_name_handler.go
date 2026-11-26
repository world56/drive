package resource

import (
	"net/http"

	"asset/api/internal/logic/resource"
	"asset/api/internal/svc"
	"asset/api/internal/types"

	"github.com/zeromicro/go-zero/rest/httpx"
)

func GetResourceByObjectNameHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.GetResourceByObjectNameReq
		if err := httpx.Parse(r, &req); err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
			return
		}

		l := resource.NewGetResourceByObjectNameLogic(r.Context(), svcCtx)
		resp, err := l.GetResourceByObjectName(&req)
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.OkJsonCtx(r.Context(), w, resp)
		}
	}
}
