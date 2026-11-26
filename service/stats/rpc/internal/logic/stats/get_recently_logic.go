package statslogic

import (
	"context"
	"encoding/json"
	"time"

	"stats/rpc/internal/svc"
	"stats/rpc/pb"

	"google.golang.org/protobuf/types/known/emptypb"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetRecentlyLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewGetRecentlyLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetRecentlyLogic {
	return &GetRecentlyLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *GetRecentlyLogic) GetRecently(_ *emptypb.Empty) (*pb.GetResourceResp, error) {
	var recently []*pb.ResourceItem
	list, err := l.svcCtx.Redis.Get(l.ctx, "drive:recently").Bytes()
	if err == nil {
		if json.Unmarshal(list, &recently) == nil {
			return &pb.GetResourceResp{List: recently}, nil
		}
	}

	if len(recently) > 0 {
		return &pb.GetResourceResp{List: recently}, nil
	}

	data, err := l.svcCtx.ResourceRpc.GetRecently(l.ctx, &emptypb.Empty{})
	if err != nil {
		return nil, err
	}

	recently = make([]*pb.ResourceItem, 0, len(data.List))
	for _, val := range data.List {
		recently = append(recently, &pb.ResourceItem{
			Id:       val.Id,
			Type:     val.Type,
			FullName: val.FullName,
			ParentId: val.ParentId,
		})
	}

	j, err := json.Marshal(recently)
	if err != nil {
		return nil, err
	}

	if err := l.svcCtx.Redis.Set(l.ctx, "drive:recently", j, time.Minute).Err(); err != nil {
		return nil, err
	} else {
		return &pb.GetResourceResp{List: recently}, nil
	}
}
