package statslogic

import (
	"context"
	"strconv"

	"stats/rpc/internal/svc"
	"stats/rpc/pb"

	"google.golang.org/protobuf/types/known/emptypb"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetStorageLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewGetStorageLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetStorageLogic {
	return &GetStorageLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *GetStorageLogic) GetStorage(_ *emptypb.Empty) (*pb.GetStorageResp, error) {
	use, err := l.svcCtx.StorageRpc.GetSpaceUsage(l.ctx, &emptypb.Empty{})
	if err != nil {
		return nil, err
	}

	data, err := l.svcCtx.Redis.HGetAll(l.ctx, "drive:storage").Result()
	if err != nil {
		return nil, err
	}

	resp := &pb.GetStorageResp{
		Free:  uint64(use.GetFree()),
		Used:  uint64(use.GetUsed()),
		Total: uint64(use.GetTotal()),
	}

	if len(data) == 0 {
		count, err := l.svcCtx.ResourceRpc.GetCount(l.ctx, &emptypb.Empty{})
		if err != nil {
			return nil, err
		}

		if len(count.GetCount()) > 0 {
			fields := make(map[string]interface{}, len(count.GetCount()))
			for k, v := range count.GetCount() {
				fields[k] = v
			}
			if err := l.svcCtx.Redis.HSet(l.ctx, "drive:storage", fields).Err(); err != nil {
				return nil, err
			}
		}
		resp.Storage = count.GetCount()
		return resp, nil
	}

	storage := make(map[string]int64, len(data))
	for key, value := range data {
		n, err := strconv.ParseInt(value, 10, 64)
		if err != nil {
			return nil, err
		}
		storage[key] = n
	}
	resp.Storage = storage
	return resp, nil
}
