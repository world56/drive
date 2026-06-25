package minioclient

import (
	minio "github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

func InitMinio(point string, accessKey string, accessSecret string) (*minio.Client, error) {
	client, err := minio.New(
		point, &minio.Options{
			Creds:  credentials.NewStaticV4(accessKey, accessSecret, ""),
			Secure: false,
		},
	)

	if err != nil {
		return nil, err
	}

	return client, nil
}
