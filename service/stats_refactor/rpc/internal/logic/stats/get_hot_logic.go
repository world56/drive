package statslogic

import (
	"context"

	"stats/rpc/internal/svc"
	"stats/rpc/pb"

	"google.golang.org/protobuf/types/known/emptypb"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetHotLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewGetHotLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetHotLogic {
	return &GetHotLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *GetHotLogic) GetHot(_ *emptypb.Empty) (*pb.GetHotResp, error) {
	data, err := l.svcCtx.Redis.ZRevRangeWithScores(l.ctx, "drive:hot", 0, 9).Result()
	if err != nil {
		return nil, err
	}

	list := make([]*pb.HotItem, 0, len(data))
	for _, z := range data {
		name, _ := z.Member.(string)
		list = append(list, &pb.HotItem{
			Name:  name,
			Value: z.Score,
		})
	}
	return &pb.GetHotResp{List: list}, nil
}
