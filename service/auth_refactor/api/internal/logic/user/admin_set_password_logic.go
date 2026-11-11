// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package user

import (
	"context"

	"auth/api/internal/svc"
	"auth/api/internal/types"

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
	// todo: add your logic here and delete this line

	return nil
}
