// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package account

import (
	"context"

	"auth/internal/svc"
	"auth/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type HasSuperAdminLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewHasSuperAdminLogic(ctx context.Context, svcCtx *svc.ServiceContext) *HasSuperAdminLogic {
	return &HasSuperAdminLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *HasSuperAdminLogic) HasSuperAdmin() (resp *types.HasSuperAdminResp, err error) {
	// todo: add your logic here and delete this line

	return
}
