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

type GetUserInfoLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewGetUserInfoLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetUserInfoLogic {
	return &GetUserInfoLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetUserInfoLogic) GetUserInfo(req *types.UserInfoReq) (resp *types.UserInfoResp, err error) {
	data, err := l.svcCtx.UserRpc.GetUser(l.ctx, &pb.GetUserReq{Id: req.Id})
	if err != nil {
		return nil, err
	}

	return &types.UserInfoResp{
		Id:         data.Id,
		Name:       data.Name,
		Role:       int(data.Role),
		Account:    data.Account,
		Status:     int(data.Status),
		Contact:    data.GetContact(),
		Remark:     data.GetRemark(),
		CreateTime: data.CreateTime,
	}, nil
}
