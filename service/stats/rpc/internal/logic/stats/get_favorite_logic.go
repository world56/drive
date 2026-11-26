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

type GetFavoriteLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewGetFavoriteLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetFavoriteLogic {
	return &GetFavoriteLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *GetFavoriteLogic) GetFavorite(_ *emptypb.Empty) (*pb.GetResourceResp, error) {
	var favorite []*pb.ResourceItem
	list, err := l.svcCtx.Redis.Get(l.ctx, "drive:favorite").Bytes()
	if err == nil {
		if json.Unmarshal(list, &favorite) == nil {
			return &pb.GetResourceResp{List: favorite}, nil
		}
	}

	if len(favorite) > 0 {
		return &pb.GetResourceResp{List: favorite}, nil
	}

	data, err := l.svcCtx.FavoriteRpc.GetFavoriteTrend(l.ctx, &emptypb.Empty{})
	if err != nil {
		return nil, err
	}

	favorite = make([]*pb.ResourceItem, 0, len(data.List))
	for _, val := range data.List {
		favorite = append(favorite, &pb.ResourceItem{
			Id:       val.Id,
			Type:     val.Type,
			FullName: val.FullName,
			ParentId: val.ParentId,
		})
	}

	j, err := json.Marshal(favorite)
	if err != nil {
		return nil, err
	}

	if err := l.svcCtx.Redis.Set(l.ctx, "drive:favorite", j, time.Minute).Err(); err != nil {
		return nil, err
	} else {
		return &pb.GetResourceResp{List: favorite}, nil
	}
}
