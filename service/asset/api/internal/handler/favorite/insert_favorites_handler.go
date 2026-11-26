// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package favorite

import (
	"net/http"

	"asset/api/internal/logic/favorite"
	"asset/api/internal/svc"
	"asset/api/internal/types"
	"github.com/zeromicro/go-zero/rest/httpx"
)

func InsertFavoritesHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.UpdateFavoritesReq
		if err := httpx.Parse(r, &req); err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
			return
		}

		l := favorite.NewInsertFavoritesLogic(r.Context(), svcCtx)
		err := l.InsertFavorites(&req)
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.Ok(w)
		}
	}
}
