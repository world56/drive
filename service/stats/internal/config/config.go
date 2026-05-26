package config

import (
	"os"
	"sync"

	"github.com/joho/godotenv"
)

var loadEnvOnce sync.Once

type Config struct {
	HTTP_ADDR       string
	REDIS_URL       string
	GRPC_STATS_ADDR string
}

func Load() Config {
	loadEnvOnce.Do(func() {
		_ = godotenv.Load()
	})

	return Config{
		HTTP_ADDR:       getEnv("HTTP_ADDR"),
		REDIS_URL:       getEnv("REDIS_URL"),
		GRPC_STATS_ADDR: getEnv("GRPC_STATS_ADDR"),
	}
}

func getEnv(key string) string {
	if v, success := os.LookupEnv(key); success && v != "" {
		return v
	}
	return ""
}
