package config

import "github.com/zeromicro/go-zero/zrpc"

type Config struct {
	zrpc.RpcServerConf

	MINIO_ADDR          string
	MINIO_BUCKET        string
	MINIO_ACCESS_KEY    string
	MINIO_ACCESS_SECRET string
}
