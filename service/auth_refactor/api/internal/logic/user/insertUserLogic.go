// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package user

import (
	"context"

	"auth/internal/svc"
	"auth/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type InsertUserLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewInsertUserLogic(ctx context.Context, svcCtx *svc.ServiceContext) *InsertUserLogic {
	return &InsertUserLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *InsertUserLogic) InsertUser(req *types.UserInsertReq) error {
	// todo: add your logic here and delete this line

	return nil
}
