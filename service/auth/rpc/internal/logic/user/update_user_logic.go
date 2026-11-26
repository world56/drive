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
	id, err := idgen.Parse(in.Id)
	if err != nil {
		return nil, errors.New("User not found")
	}

	if err := db.Where("id = ?", id).First(&model.User{}).Error; err != nil {
		return nil, errors.New("User not found")
	}

	update := map[string]interface{}{
		"name":    in.Name,
		"remark":  in.Remark,
		"contact": in.Contact,
	}

	if err := db.Model(&model.User{}).
		Where("id = ?", id).
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
		Desc:       utils.ToDescString(update),
		OperatorId: ctxdata.UserInfo(l.ctx).Id,
	})
	return &emptypb.Empty{}, nil
}
