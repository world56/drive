package service

import (
	"context"
	"storage/internal/pkg/minio"
)

type StatsService struct {
	bucket string
	minio  *minio.Client
}

func newStatsService(bucket string, client *minio.Client) *StatsService {
	return &StatsService{
		bucket: bucket,
		minio:  client,
	}
}

func (s *StatsService) GetSpaceUsage(c context.Context) (free, total, used int64, err error) {
	usage, err := s.minio.DataUsageInfo(c)
	if err != nil {
		return 0, 0, 0, err
	}
	used = int64(usage.BucketsUsage[s.bucket].Size)

	clusterTotal, clusterFree, err := s.minio.ClusterSpace(c)
	if err != nil {
		return 0, 0, 0, err
	}
	total = int64(clusterTotal)
	free = int64(clusterFree)

	quota, err := s.minio.GetBucketQuota(c, s.bucket)
	if err != nil {
		return 0, 0, 0, err
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
	return free, total, used, nil
}
