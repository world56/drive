package config

import (
	"common/env"
)

type Config struct {
	HTTP_ADDR       string
	POSTGRES_DSN    string
	REDIS_URL       string
	JWT_SECRET      string
	GRPC_AUTH_ADDR  string
	GRPC_STATS_ADDR string
}

func Load() Config {
	env.LoadEnv()

	return Config{
		HTTP_ADDR:       env.GetEnv("HTTP_ADDR"),
		GRPC_AUTH_ADDR:  env.GetEnv("GRPC_AUTH_ADDR"),
		GRPC_STATS_ADDR: env.GetEnv("GRPC_STATS_ADDR"),
		POSTGRES_DSN:    env.GetEnv("POSTGRES_DSN"),
		REDIS_URL:       env.GetEnv("REDIS_URL"),
		JWT_SECRET:      env.GetEnv("JWT_SECRET"),
	}
}
