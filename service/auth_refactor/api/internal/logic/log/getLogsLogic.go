// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package log

import (
	"context"

	"auth/internal/svc"
	"auth/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetLogsLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewGetLogsLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetLogsLogic {
	return &GetLogsLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetLogsLogic) GetLogs(req *types.LogsReq) (resp *types.LogsResp, err error) {
	// todo: add your logic here and delete this line

	return
}
