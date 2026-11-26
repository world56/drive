package minioadmin

import (
	"context"

	"github.com/minio/madmin-go/v3"
)

type Admin struct {
	client *madmin.AdminClient
}

func InitAdmin(endpoint, accessKey, accessSecret string) (*Admin, error) {
	client, err := madmin.New(endpoint, accessKey, accessSecret, false)
	if err != nil {
		return nil, err
	}
	return &Admin{client: client}, nil
}

func (c *Admin) DataUsageInfo(ctx context.Context) (madmin.DataUsageInfo, error) {
	return c.client.DataUsageInfo(ctx)
}

func (c *Admin) ClusterSpace(ctx context.Context) (total, free uint64, err error) {
	info, err := c.client.StorageInfo(ctx)
	if err != nil {
		return 0, 0, err
	}

	for _, disk := range info.Disks {
		if disk.PoolIndex < 0 || disk.PoolIndex >= len(info.Backend.StandardSCData) {
			continue
		}
		if disk.DiskIndex < info.Backend.StandardSCData[disk.PoolIndex] {
			total += disk.TotalSpace
			free += disk.AvailableSpace
		}
	}
	if total > 0 {
		return total, free, nil
	}

	for _, disk := range info.Disks {
		if disk.State != madmin.DriveStateOk {
			continue
		}
		total += disk.TotalSpace
		free += disk.AvailableSpace
	}
	return total, free, nil
}

func (c *Admin) GetBucketQuota(ctx context.Context, bucket string) (madmin.BucketQuota, error) {
	return c.client.GetBucketQuota(ctx, bucket)
}
