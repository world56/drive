// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package account

import (
	"context"

	"auth/api/internal/svc"
	"auth/api/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
	"google.golang.org/protobuf/types/known/emptypb"
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
	data, err := l.svcCtx.AccountRpc.ExistAdmin(l.ctx, &emptypb.Empty{})
	if err != nil {
		return nil, err
	}

	return &types.HasSuperAdminResp{Exists: data.Exists}, nil
}
