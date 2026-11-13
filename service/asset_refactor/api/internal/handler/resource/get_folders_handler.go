// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package resource

import (
	"net/http"

	"asset/api/internal/logic/resource"
	"asset/api/internal/svc"
	"github.com/zeromicro/go-zero/rest/httpx"
)

func GetFoldersHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		l := resource.NewGetFoldersLogic(r.Context(), svcCtx)
		resp, err := l.GetFolders()
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.OkJsonCtx(r.Context(), w, resp)
		}
	}
}
