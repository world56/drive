package svc

import (
	minioclient "common/minio"
	"storage/rpc/internal/config"
	minioadmin "storage/rpc/internal/pkg/minio_admin"

	"github.com/minio/minio-go/v7"
	"github.com/zeromicro/go-zero/core/logx"
)

type ServiceContext struct {
	Config      config.Config
	MinioAdmin  *minioadmin.Admin
	MinioClient *minio.Core
}

func NewServiceContext(c config.Config) *ServiceContext {
	admin, err := minioadmin.InitAdmin(
		c.MINIO_ADDR,
		c.MINIO_ACCESS_KEY,
		c.MINIO_ACCESS_SECRET,
	)
	logx.Must(err)

	minioClient, err := minioclient.InitMinio(
		c.MINIO_ADDR,
		c.MINIO_ACCESS_KEY,
		c.MINIO_ACCESS_SECRET,
		c.MINIO_BUCKET,
	)
	logx.Must(err)

	return &ServiceContext{
		Config:      c,
		MinioAdmin:  admin,
		MinioClient: minioClient,
	}
}
