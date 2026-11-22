package loglogic

import (
	"context"
	"errors"

	"auth/rpc/internal/model"
	"auth/rpc/internal/svc"
	"auth/rpc/pb"
	"common/ctxdata"

	"google.golang.org/protobuf/types/known/emptypb"

	"github.com/zeromicro/go-zero/core/logx"
)

type CreateLogLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewCreateLogLogic(ctx context.Context, svcCtx *svc.ServiceContext) *CreateLogLogic {
	return &CreateLogLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *CreateLogLogic) CreateLog(in *pb.CreateLogReq) (*emptypb.Empty, error) {
	userID := in.OperatorId
	if userID == 0 {
		userID = ctxdata.UserInfo(l.ctx).Id
	}
	if userID == 0 {
		return nil, errors.New("@-ERROR Log write failed")
	}

	if err := l.svcCtx.DB.WithContext(l.ctx).Create(&model.Log{
		UserId: userID,
		Desc:   in.Desc,
		Event:  in.Event,
	}).Error; err != nil {
		l.Errorf("write log failed: %v", err)
		return nil, errors.New("@-ERROR Log write failed")
	}
	return &emptypb.Empty{}, nil
}
