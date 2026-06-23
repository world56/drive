package config

import (
	"common/env"
)

type Config struct {
	HTTP_ADDR       string
	REDIS_URL       string
	GRPC_STATS_ADDR string
}

func Load() Config {
	env.LoadEnv()

	return Config{
		HTTP_ADDR:       env.GetEnv("HTTP_ADDR"),
		REDIS_URL:       env.GetEnv("REDIS_URL"),
		GRPC_STATS_ADDR: env.GetEnv("GRPC_STATS_ADDR"),
	}
}
