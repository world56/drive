// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package user

import (
	"context"

	"auth/internal/svc"
	"auth/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetAllUsersLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewGetAllUsersLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetAllUsersLogic {
	return &GetAllUsersLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetAllUsersLogic) GetAllUsers() (resp *types.AllUsersResp, err error) {
	// todo: add your logic here and delete this line

	return
}
