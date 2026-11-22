package svc

import (
	resourceclient "asset/rpc/client/resource"
	logclient "auth/rpc/client/log"
	interceptorclient "common/interceptor/client"
	minioclient "common/minio"
	"storage/rpc/internal/config"
	minioadmin "storage/rpc/internal/pkg/minio_admin"

	"github.com/minio/minio-go/v7"
	"github.com/zeromicro/go-zero/core/logx"
	"github.com/zeromicro/go-zero/zrpc"
)

type ServiceContext struct {
	Config      config.Config
	MinioAdmin  *minioadmin.Admin
	MinioClient *minio.Core
	AssetRpc    resourceclient.Resource
	LogRpc      logclient.Log
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

	authCli := zrpc.MustNewClient(c.AuthRpc, zrpc.WithUnaryClientInterceptor(interceptorclient.UnaryUser))
	assetCli := zrpc.MustNewClient(c.AssetRpc, zrpc.WithUnaryClientInterceptor(interceptorclient.UnaryUser))

	return &ServiceContext{
		Config:      c,
		MinioAdmin:  admin,
		MinioClient: minioClient,
		LogRpc:      logclient.NewLog(authCli),
		AssetRpc:    resourceclient.NewResource(assetCli),
	}
}
