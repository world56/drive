package config

import (
	"github.com/zeromicro/go-zero/zrpc"
)

type Config struct {
	zrpc.RpcServerConf

	PostgresDSN string
	RedisUrl    string
	RabbitMqUrl string
	JwtSecret   string
}
