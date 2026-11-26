package userlogic

import (
	utils "common/utils/jsonstring"
	"context"
	"errors"

	"auth/rpc/internal/enum"
	loglogic "auth/rpc/internal/logic/log"
	"auth/rpc/internal/model"
	"auth/rpc/internal/svc"
	"auth/rpc/pb"
	"common/ctxdata"
	"common/idgen"

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

	id, err := idgen.Parse(in.Id)
	if err != nil {
		return nil, errors.New("User not found")
	}

	var user model.User
	if err := db.Select("id", "status", "account", "name").
		Where("id = ?", id).
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
		Where("id = ?", id).
		Update("status", status).Error; err != nil {
		return nil, err
	}

	l.svcCtx.Redis.Del(l.ctx, "drive:user:"+in.Id) // 被冻结立即踢下线

	user.Status = status // 最新修改的状态
	loglogic.NewCreateLogLogic(l.ctx, l.svcCtx).CreateLog(&pb.CreateLogReq{
		Event:      enum.LogEventUserStatus,
		OperatorId: ctxdata.UserInfo(l.ctx).Id,
		Desc: utils.ToDescString(map[string]interface{}{
			"status":  status,
			"id":      user.Id,
			"name":    user.Name,
			"account": user.Account,
		}),
	})

	return &emptypb.Empty{}, nil
}
