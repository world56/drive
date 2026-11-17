// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package config

import (
	"github.com/zeromicro/go-zero/rest"
	"github.com/zeromicro/go-zero/zrpc"
)

type Config struct {
	rest.RestConf

	RedisUrl    string
	RabbitMqUrl string

	AssetRpc zrpc.RpcClientConf

	MINIO_ADDR          string
	MINIO_BUCKET        string
	MINIO_ACCESS_KEY    string
	MINIO_ACCESS_SECRET string
}
