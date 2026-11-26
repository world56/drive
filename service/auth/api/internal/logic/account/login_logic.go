// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package account

import (
	"context"

	"auth/api/internal/svc"
	"auth/api/internal/types"
	"auth/rpc/pb"

	"github.com/zeromicro/go-zero/core/logx"
)

type LoginLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewLoginLogic(ctx context.Context, svcCtx *svc.ServiceContext) *LoginLogic {
	return &LoginLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *LoginLogic) Login(req *types.LoginReq) (*string, error) {
	resp, err := l.svcCtx.AccountRpc.Login(l.ctx, &pb.UserAuthReq{Data: req.Data})
	if err != nil {
		return nil, err
	}

	return &resp.Token, nil
}
