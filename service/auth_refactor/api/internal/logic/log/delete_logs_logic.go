// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package log

import (
	"context"

	"auth/api/internal/svc"

	"github.com/zeromicro/go-zero/core/logx"
	"google.golang.org/protobuf/types/known/emptypb"
)

type DeleteLogsLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewDeleteLogsLogic(ctx context.Context, svcCtx *svc.ServiceContext) *DeleteLogsLogic {
	return &DeleteLogsLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *DeleteLogsLogic) DeleteLogs() error {
	_, err := l.svcCtx.LogRpc.DeleteAllLogs(l.ctx, &emptypb.Empty{})
	return err
}
