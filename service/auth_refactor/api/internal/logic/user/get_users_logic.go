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

type GetUsersLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewGetUsersLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetUsersLogic {
	return &GetUsersLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetUsersLogic) GetUsers(req *types.UsersReq) (resp *types.UsersResp, err error) {
	in := &pb.GetUsersReq{
		Name:        req.Name,
		Account:     req.Account,
		PageSize:    int64(req.PageSize),
		CurrentPage: int64(req.CurrentPage),
	}
	if req.Status != nil {
		status := int32(*req.Status)
		in.Status = &status
	}

	data, err := l.svcCtx.UserRpc.GetUsers(l.ctx, in)
	if err != nil {
		return nil, err
	}

	list := make([]types.User, 0, len(data.List))
	for _, item := range data.List {
		list = append(list, types.User{
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

	return &types.UsersResp{
		List:  list,
		Count: int(data.Count),
	}, nil
}
