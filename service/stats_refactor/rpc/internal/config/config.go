package config

import "github.com/zeromicro/go-zero/zrpc"

type Config struct {
	zrpc.RpcServerConf

	RedisUrl   string
	AssetRpc   zrpc.RpcClientConf
	StorageRpc zrpc.RpcClientConf
}
