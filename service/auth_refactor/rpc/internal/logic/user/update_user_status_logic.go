package userlogic

import (
	utils "common/utils/jsonstring"
	"context"
	"errors"

	"auth/rpc/internal/enum"
	loglogic "auth/rpc/internal/logic/log"
	"auth/rpc/internal/model"
	"auth/rpc/internal/pkg/ctxdata"
	"auth/rpc/internal/svc"
	"auth/rpc/pb"

	"google.golang.org/protobuf/types/known/emptypb"

	"github.com/zeromicro/go-zero/core/logx"
)

type UpdateUserStatusLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewUpdateUserStatusLogic(ctx context.Context, svcCtx *svc.ServiceContext) *UpdateUserStatusLogic {
	return &UpdateUserStatusLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *UpdateUserStatusLogic) UpdateUserStatus(in *pb.UpdateUserStatusReq) (*emptypb.Empty, error) {
	db := l.svcCtx.DB.WithContext(l.ctx)

	var user model.User
	if err := db.Select("id", "status", "account", "name").
		Where("id = ?", in.Id).
		First(&user).Error; err != nil {
		return nil, errors.New("User not found")
	}

	var status int
	if user.Status == enum.UserStatusFreeze {
		status = enum.UserStatusActive
	} else {
		status = enum.UserStatusFreeze
	}

	if err := db.
		Model(&user).
		Where("id = ?", in.Id).
		Update("status", status).Error; err != nil {
		return nil, err
	}

	l.svcCtx.Redis.Del(l.ctx, "drive:user:"+in.Id) // 被冻结立即踢下线

	user.Status = status // 最新修改的状态
	loglogic.NewCreateLogLogic(l.ctx, l.svcCtx).CreateLog(&pb.CreateLogReq{
		Event:      enum.LogEventUserStatus,
		OperatorId: ctxdata.OperatorId(l.ctx),
		Desc: utils.ToDescString(map[string]interface{}{
			"status":  status,
			"id":      user.Id,
			"name":    user.Name,
			"account": user.Account,
		}),
	})

	return &emptypb.Empty{}, nil
}
