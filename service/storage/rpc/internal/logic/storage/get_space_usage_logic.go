package storagelogic

import (
	"context"

	"storage/rpc/internal/svc"
	"storage/rpc/pb"

	"github.com/zeromicro/go-zero/core/logx"
	"google.golang.org/protobuf/types/known/emptypb"
)

type GetSpaceUsageLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewGetSpaceUsageLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetSpaceUsageLogic {
	return &GetSpaceUsageLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *GetSpaceUsageLogic) GetSpaceUsage(in *emptypb.Empty) (*pb.SpaceUsage, error) {
	bucket := l.svcCtx.Config.MINIO_BUCKET
	admin := l.svcCtx.MinioAdmin

	usage, err := admin.DataUsageInfo(l.ctx)
	if err != nil {
		return nil, err
	}
	used := int64(usage.BucketsUsage[bucket].Size)

	clusterTotal, clusterFree, err := admin.ClusterSpace(l.ctx)
	if err != nil {
		return nil, err
	}
	total := int64(clusterTotal)
	free := int64(clusterFree)

	quota, err := admin.GetBucketQuota(l.ctx, bucket)
	if err != nil {
		return nil, err
	}

	limit := quota.Size
	if limit == 0 {
		limit = quota.Quota
	}

	if limit > 0 {
		total = int64(limit)
		remain := int64(0)
		if limit > uint64(used) {
			remain = int64(limit) - used
		}
		if remain < free {
			free = remain
		}
	}
	if free < 0 {
		free = 0
	}

	return &pb.SpaceUsage{
		Free:  free,
		Total: total,
		Used:  used,
	}, nil
}
