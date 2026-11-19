package statslogic

import (
	"context"
	"time"

	"stats/rpc/internal/svc"
	"stats/rpc/pb"

	"google.golang.org/protobuf/types/known/emptypb"

	"github.com/redis/go-redis/v9"
	"github.com/zeromicro/go-zero/core/logx"
)

type GetAccessTrendsLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewGetAccessTrendsLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetAccessTrendsLogic {
	return &GetAccessTrendsLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *GetAccessTrendsLogic) GetAccessTrends(_ *emptypb.Empty) (*pb.GetAccessTrendsResp, error) {
	now := time.Now()
	list := make([]*pb.AccessItem, 14)

	pipe := l.svcCtx.Redis.Pipeline()
	cmds := make([]*redis.IntCmd, 14)
	for i := range 14 {
		date := now.AddDate(0, 0, -i).Format("01-02")
		list[i] = &pb.AccessItem{Date: date}
		cmds[i] = pipe.SCard(l.ctx, "drive:use:"+date)
	}

	if _, err := pipe.Exec(l.ctx); err != nil {
		return nil, err
	}
	for i, cmd := range cmds {
		if value, err := cmd.Result(); err == nil {
			list[i].Value = value
		}
	}

	return &pb.GetAccessTrendsResp{List: list}, nil
}
