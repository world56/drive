// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package user

import (
	"context"

	"auth/api/internal/svc"
	"auth/api/internal/types"
	"auth/rpc/pb"

	"github.com/zeromicro/go-zero/core/logx"
)

type AdminSetPasswordLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewAdminSetPasswordLogic(ctx context.Context, svcCtx *svc.ServiceContext) *AdminSetPasswordLogic {
	return &AdminSetPasswordLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *AdminSetPasswordLogic) AdminSetPassword(req *types.AdminSetPasswordReq) error {
	_, err := l.svcCtx.UserRpc.AdminResetUserPassword(l.ctx, &pb.AdminResetUserPasswordReq{
		Id:       req.Id,
		Password: req.Data,
	})
	return err
}
