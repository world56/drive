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

type GetUserLoginInfoLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewGetUserLoginInfoLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetUserLoginInfoLogic {
	return &GetUserLoginInfoLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetUserLoginInfoLogic) GetUserLoginInfo(req *types.UserLoginInfoReq) (resp *types.UserLoginInfoResp, err error) {
	user, err := l.svcCtx.AccountRpc.GetLoginUser(l.ctx, &pb.LoginUserReq{Id: req.UserId})
	if err != nil {
		return nil, err
	}

	return &types.UserLoginInfoResp{
		Id:      user.Id,
		Name:    user.Name,
		Account: user.Account,
		Role:    int(user.Role),
	}, err
}
