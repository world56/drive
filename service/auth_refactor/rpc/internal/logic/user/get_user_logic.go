package userlogic

import (
	"context"

	"auth/rpc/internal/model"
	"auth/rpc/internal/svc"
	"auth/rpc/pb"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetUserLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewGetUserLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetUserLogic {
	return &GetUserLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *GetUserLogic) GetUser(in *pb.GetUserReq) (*pb.UserInfo, error) {
	var user *pb.UserInfo
	if err := l.svcCtx.DB.WithContext(l.ctx).Model(&model.User{}).
		Select("id", "name", "role", "status", "account", "remark", "contact", "createTime").
		Where("id = ?", in.Id).
		First(&user).Error; err != nil {
		return nil, err
	}

	return user, nil
}
