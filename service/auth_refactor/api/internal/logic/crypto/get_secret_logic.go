// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package crypto

import (
	"context"

	"auth/api/internal/svc"
	"auth/api/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
	"google.golang.org/protobuf/types/known/emptypb"
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
	key, err := l.svcCtx.CryptoRpc.GetPublicKey(l.ctx, &emptypb.Empty{})
	if err != nil {
		return nil, err
	}

	return &types.SecretResp{Text: key.PublicKey}, nil
}
