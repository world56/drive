package config

import (
	"os"
	"sync"

	"github.com/joho/godotenv"
)

var loadEnvOnce sync.Once

type Config struct {
	HTTP_ADDR       string
	POSTGRES_DSN    string
	REDIS_URL       string
	JWT_SECRET      string
	GRPC_AUTH_ADDR  string
	GRPC_STATS_ADDR string
}

func Load() Config {
	loadEnvOnce.Do(func() {
		// Best-effort local development support; production can inject env directly.
		_ = godotenv.Load()
	})

	return Config{
		HTTP_ADDR:       getEnv("HTTP_ADDR"),
		GRPC_AUTH_ADDR:  getEnv("GRPC_AUTH_ADDR"),
		GRPC_STATS_ADDR: getEnv("GRPC_STATS_ADDR"),
		POSTGRES_DSN:    getEnv("POSTGRES_DSN"),
		REDIS_URL:       getEnv("REDIS_URL"),
		JWT_SECRET:      getEnv("JWT_SECRET"),
	}
}

func getEnv(key string) string {
	if value, ok := os.LookupEnv(key); ok && value != "" {
		return value
	}
	return ""
}
