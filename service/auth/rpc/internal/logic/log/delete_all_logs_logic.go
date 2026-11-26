package loglogic

import (
	"context"

	"auth/rpc/internal/model"
	"auth/rpc/internal/svc"

	"google.golang.org/protobuf/types/known/emptypb"
	"gorm.io/gorm"

	"github.com/zeromicro/go-zero/core/logx"
)

type DeleteAllLogsLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewDeleteAllLogsLogic(ctx context.Context, svcCtx *svc.ServiceContext) *DeleteAllLogsLogic {
	return &DeleteAllLogsLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *DeleteAllLogsLogic) DeleteAllLogs(in *emptypb.Empty) (*emptypb.Empty, error) {
	err := l.svcCtx.DB.WithContext(l.ctx).
		Session(&gorm.Session{AllowGlobalUpdate: true}).
		Delete(&model.Log{}).Error
	if err != nil {
		return nil, err
	}
	return &emptypb.Empty{}, nil
}
