package config

import "github.com/zeromicro/go-zero/zrpc"

type Config struct {
	PostgresDSN string
	RedisUrl    string
	RabbitMqUrl string
	AuthRpc     zrpc.RpcClientConf
	StatsRpc    zrpc.RpcClientConf
}
