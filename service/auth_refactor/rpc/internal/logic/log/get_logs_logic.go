package loglogic

import (
	"context"

	"auth/rpc/internal/model"
	"auth/rpc/internal/svc"
	"auth/rpc/pb"

	"github.com/zeromicro/go-zero/core/logx"
	"gorm.io/gorm"
)

type GetLogsLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewGetLogsLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetLogsLogic {
	return &GetLogsLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *GetLogsLogic) GetLogs(in *pb.GetLogsReq) (*pb.GetLogsResp, error) {
	db := l.svcCtx.DB.WithContext(l.ctx).Model(&model.Log{})

	if in.Event != "" {
		db = db.Where("logs.event = ?", in.Event)
	}
	if in.UserId != "" {
		db = db.Where("logs.user_id = ?", in.UserId)
	}

	var count int64
	if err := db.Session(&gorm.Session{}).Count(&count).Error; err != nil {
		return nil, err
	}

	pageSize := int(in.PageSize)
	var logs []*pb.LogInfo
	if err := db.Select(`
		logs.id,
		logs.desc,
		logs.event,
		logs.user_id,
		users.name AS user_name,
		users.account AS user_account,
		to_char(logs.create_time AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS create_time
	`).
		Joins("LEFT JOIN users ON users.id = logs.user_id").
		Order("logs.create_time DESC").
		Limit(pageSize).
		Offset((int(in.CurrentPage) - 1) * pageSize).
		Scan(&logs).Error; err != nil {
		return nil, err
	}

	return &pb.GetLogsResp{List: logs, Count: count}, nil
}
