// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package crypto

import (
	"net/http"

	"auth/api/internal/logic/crypto"
	"auth/api/internal/svc"
	"github.com/zeromicro/go-zero/rest/httpx"
)

func GetSecretHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		l := crypto.NewGetSecretLogic(r.Context(), svcCtx)
		resp, err := l.GetSecret()
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.OkJsonCtx(r.Context(), w, resp)
		}
	}
}
