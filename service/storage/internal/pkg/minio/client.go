package minio

import (
	"context"
	"time"

	"github.com/minio/madmin-go/v3"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

type Client struct {
	*minio.Core
	admin *madmin.AdminClient
}

func InitMinio(point string, accessKey string, accessSecret string, bucket string) (*Client, error) {
	client, err := minio.New(
		point, &minio.Options{
			Creds:  credentials.NewStaticV4(accessKey, accessSecret, ""),
			Secure: false,
		},
	)
	if err != nil {
		return nil, err
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	exists, err := client.BucketExists(ctx, bucket)
	if err != nil {
		return nil, err
	}

	if !exists {
		if err := client.MakeBucket(ctx, bucket, minio.MakeBucketOptions{}); err != nil {
			return nil, err
		}
	}

	admin, err := madmin.New(point, accessKey, accessSecret, false)
	if err != nil {
		return nil, err
	}

	return &Client{
		Core:  &minio.Core{Client: client},
		admin: admin,
	}, nil
}

func (c *Client) DataUsageInfo(ctx context.Context) (madmin.DataUsageInfo, error) {
	return c.admin.DataUsageInfo(ctx)
}

func (c *Client) ClusterSpace(ctx context.Context) (total, free uint64, err error) {
	info, err := c.admin.StorageInfo(ctx)
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

func (c *Client) GetBucketQuota(ctx context.Context, bucket string) (madmin.BucketQuota, error) {
	return c.admin.GetBucketQuota(ctx, bucket)
}
