// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package log

import (
	"context"

	"auth/api/internal/svc"
	"auth/api/internal/types"
	"auth/rpc/pb"

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
	logs, err := l.svcCtx.LogRpc.GetLogs(l.ctx, &pb.GetLogsReq{
		UserId:      req.UserId,
		Event:       req.Event,
		PageSize:    int64(req.PageSize),
		CurrentPage: int64(req.CurrentPage),
	})
	if err != nil {
		return nil, err
	}

	list := make([]types.Log, 0, len(logs.List))
	for _, item := range logs.List {
		list = append(list, types.Log{
			Id:          item.Id,
			UserId:      item.UserId,
			UserName:    item.UserName,
			UserAccount: item.UserAccount,
			Event:       item.Event,
			Desc:        item.Desc,
			CreateTime:  item.CreateTime,
		})
	}

	return &types.LogsResp{
		List:  list,
		Count: int(logs.Count),
	}, nil
}
