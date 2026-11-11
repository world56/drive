// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package crypto

import (
	"context"

	"auth/internal/svc"
	"auth/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetSecretLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewGetSecretLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetSecretLogic {
	return &GetSecretLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetSecretLogic) GetSecret() (resp *types.SecretResp, err error) {
	// todo: add your logic here and delete this line

	return
}
