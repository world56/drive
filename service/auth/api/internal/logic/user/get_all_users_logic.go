// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package user

import (
	"context"

	"auth/api/internal/svc"
	"auth/api/internal/types"

	"google.golang.org/protobuf/types/known/emptypb"

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
	data, err := l.svcCtx.UserRpc.GetAllUsers(l.ctx, &emptypb.Empty{})
	if err != nil {
		return nil, err
	}

	users := make([]types.User, 0, len(data.List))
	for _, item := range data.List {
		users = append(users, types.User{
			Id:         item.Id,
			Name:       item.Name,
			Role:       int(item.Role),
			Account:    item.Account,
			Status:     int(item.Status),
			Contact:    item.GetContact(),
			Remark:     item.GetRemark(),
			CreateTime: item.CreateTime,
		})
	}

	return &types.AllUsersResp{Users: users}, nil
}
