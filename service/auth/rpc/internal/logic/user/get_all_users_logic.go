package userlogic

import (
	"context"

	"auth/rpc/internal/model"
	"auth/rpc/internal/svc"
	"auth/rpc/pb"

	"google.golang.org/protobuf/types/known/emptypb"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetAllUsersLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewGetAllUsersLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetAllUsersLogic {
	return &GetAllUsersLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *GetAllUsersLogic) GetAllUsers(in *emptypb.Empty) (*pb.GetAllUsersResp, error) {
	var users []*pb.UserInfo
	if err := l.svcCtx.DB.WithContext(l.ctx).
		Model(&model.User{}).
		Select("id", "name").
		Find(&users).
		Error; err != nil {
		return nil, err
	}
	return &pb.GetAllUsersResp{List: users}, nil
}
