package minio

import (
	"context"
	"fmt"
	"time"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

func InitMinio(point string, accessKey string, accessSecret string, bucket string) (*minio.Core, error) {
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

	fmt.Printf("Checking if bucket %s exists...\n", bucket)
	exists, err := client.BucketExists(ctx, bucket)
	if err != nil {
		return nil, err
	}

	if !exists {
		if err := client.MakeBucket(ctx, bucket, minio.MakeBucketOptions{}); err != nil {
			return nil, err
		}
	}

	return &minio.Core{Client: client}, nil
}
