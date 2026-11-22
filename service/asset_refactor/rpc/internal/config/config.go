package config

import "github.com/zeromicro/go-zero/zrpc"

type Config struct {
	zrpc.RpcServerConf
	AuthRpc  zrpc.RpcClientConf
	StatsRpc zrpc.RpcClientConf

	PostgresDSN string
	RedisUrl    string
	RabbitMqUrl string
}
