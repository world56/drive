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
	in := &pb.CreateUserReq{
		Name:     req.Name,
		Account:  req.Account,
		Password: req.Password,
	}
	if req.Contact != "" {
		in.Contact = &req.Contact
	}
	if req.Remark != "" {
		in.Remark = &req.Remark
	}

	_, err := l.svcCtx.UserRpc.CreateUser(l.ctx, in)
	return err
}
