package config

import (
	"common/env"
)

type Config struct {
	HTTP_ADDR           string
	REDIS_URL           string
	GRPC_STORAGE_ADDR   string
	MINIO_ADDR          string
	MINIO_ACCESS_SECRET string
	MINIO_ACCESS_KEY    string
	MINIO_BUCKET        string
}

func Load() Config {
	env.LoadEnv()

	return Config{
		HTTP_ADDR:           env.GetEnv("HTTP_ADDR"),
		REDIS_URL:           env.GetEnv("REDIS_URL"),
		GRPC_STORAGE_ADDR:   env.GetEnv("GRPC_STATS_ADDR"),
		MINIO_ADDR:          env.GetEnv("MINIO_ADDR"),
		MINIO_ACCESS_KEY:    env.GetEnv("MINIO_ACCESS_KEY"),
		MINIO_ACCESS_SECRET: env.GetEnv("MINIO_ACCESS_SECRET"),
		MINIO_BUCKET:        env.GetEnv("MINIO_BUCKET"),
	}
}
