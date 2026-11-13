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

func CreateFolderHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.CreateFolderReq
		if err := httpx.Parse(r, &req); err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
			return
		}

		l := resource.NewCreateFolderLogic(r.Context(), svcCtx)
		err := l.CreateFolder(&req)
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.Ok(w)
		}
	}
}
