package statslogic

import (
	"context"
	"errors"
	"strconv"

	"stats/rpc/internal/svc"
	"stats/rpc/pb"

	"google.golang.org/protobuf/types/known/emptypb"

	"github.com/redis/go-redis/v9"
	"github.com/zeromicro/go-zero/core/logx"
)

type UpdateStorageCountLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewUpdateStorageCountLogic(ctx context.Context, svcCtx *svc.ServiceContext) *UpdateStorageCountLogic {
	return &UpdateStorageCountLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *UpdateStorageCountLogic) UpdateStorageCount(in *pb.UpdateResourceReq) (*emptypb.Empty, error) {
	var sign int32
	switch in.Calculation {
	case "ADD":
		sign = 1
	case "REDUCE":
		sign = -1
	default:
		return nil, errors.New("invalid calculation")
	}

	for resourceType, resourceCount := range in.Count {
		if resourceCount <= 0 {
			continue
		}

		key := strconv.FormatInt(int64(resourceType), 10)
		count, err := l.svcCtx.Redis.HGet(l.ctx, `drive:storage`, key).Result()
		if err == redis.Nil {
			count = "0"
		} else if err != nil {
			return nil, err
		}

		total, err := strconv.ParseInt(count, 10, 32)
		if err != nil {
			return nil, err
		}

		next := int32(total) + sign*resourceCount
		if next < 0 {
			next = 0
		}

		if _, err = l.svcCtx.Redis.HSet(l.ctx, `drive:storage`, key, next).Result(); err != nil {
			return nil, err
		}
	}

	return &emptypb.Empty{}, nil
}
