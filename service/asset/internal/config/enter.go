package config

import (
	"common/env"
)

type Config struct {
	HTTP_ADDR    string
	GRPC_ADDR    string
	POSTGRES_DSN string
	REDIS_URL    string
}

func Load() Config {
	env.LoadEnv()

	return Config{
		HTTP_ADDR:    env.GetEnv("HTTP_ADDR"),
		REDIS_URL:    env.GetEnv("REDIS_URL"),
		POSTGRES_DSN: env.GetEnv("POSTGRES_DSN"),
		GRPC_ADDR:    env.GetEnv("GRPC_ADDR"),
	}
}
