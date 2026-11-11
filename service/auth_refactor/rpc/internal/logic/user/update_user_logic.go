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

type UpdateUserLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewUpdateUserLogic(ctx context.Context, svcCtx *svc.ServiceContext) *UpdateUserLogic {
	return &UpdateUserLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *UpdateUserLogic) UpdateUser(in *pb.UpdateUserReq) (*emptypb.Empty, error) {
	db := l.svcCtx.DB.WithContext(l.ctx)

	if err := db.Where("id = ?", in.Id).First(&model.User{}).Error; err != nil {
		return nil, errors.New("User not found")
	}

	update := map[string]interface{}{
		"name":    in.Name,
		"remark":  in.Remark,
		"contact": in.Contact,
	}

	if err := db.Model(&model.User{}).
		Where("id = ?", in.Id).
		Updates(update).
		Error; err != nil {
		return nil, err
	}

	loginCacheKey := "drive:user:" + in.GetId()
	if err := l.svcCtx.Redis.HGet(l.ctx, loginCacheKey, "name").Err(); err == nil {
		l.svcCtx.Redis.HSet(l.ctx, loginCacheKey, "name", in.Name)
	}

	loglogic.NewCreateLogLogic(l.ctx, l.svcCtx).CreateLog(&pb.CreateLogReq{
		Event:      enum.LogEventUserUpdate,
		OperatorId: ctxdata.OperatorId(l.ctx),
		Desc:       utils.ToDescString(update),
	})
	return &emptypb.Empty{}, nil
}
