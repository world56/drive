package userlogic

import (
	utils "common/utils/jsonstring"
	"context"
	"errors"

	"auth/internal/enum"
	loglogic "auth/internal/logic/log"
	"auth/internal/model"
	"auth/internal/pkg/ctxdata"
	"auth/internal/svc"
	"auth/pb"

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

	loglogic.NewCreateLogLogic(l.ctx, l.svcCtx).CreateLog(&pb.CreateLogReq{
		Event:      enum.LogEventUserUpdate,
		OperatorId: ctxdata.OperatorId(l.ctx),
		Desc:       utils.ToDescString(update),
	})
	return &emptypb.Empty{}, nil
}
