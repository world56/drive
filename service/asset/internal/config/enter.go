package config

import (
	"common/env"
)

type Config struct {
	HTTP_ADDR       string
	POSTGRES_DSN    string
	REDIS_URL       string
	GRPC_ASSET_ADDR string
}

func Load() Config {
	env.LoadEnv()

	return Config{
		HTTP_ADDR:       env.GetEnv("HTTP_ADDR"),
		REDIS_URL:       env.GetEnv("REDIS_URL"),
		POSTGRES_DSN:    env.GetEnv("POSTGRES_DSN"),
		GRPC_ASSET_ADDR: env.GetEnv("GRPC_ASSET_ADDR"),
	}
}
