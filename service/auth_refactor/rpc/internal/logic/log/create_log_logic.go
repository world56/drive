package loglogic

import (
	"context"
	"errors"

	"auth/internal/model"
	"auth/internal/pkg/ctxdata"
	"auth/internal/svc"
	"auth/pb"

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
	operatorId := in.OperatorId
	if operatorId == "" {
		operatorId = ctxdata.OperatorId(l.ctx)
	}

	if err := l.svcCtx.DB.WithContext(l.ctx).Create(&model.Log{
		Desc:   in.Desc,
		Event:  in.Event,
		UserID: operatorId,
	}).Error; err != nil {
		l.Errorf("write log failed: %v", err)
		return nil, errors.New("@-ERROR Log write failed")
	}
	return &emptypb.Empty{}, nil
}
