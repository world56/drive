package config

import (
	"os"
	"sync"

	"github.com/joho/godotenv"
)

var (
	config Config
	once   sync.Once
)

type Config struct {
	HTTP_ADDR       string
	POSTGRES_DSN    string
	REDIS_URL       string
	GRPC_ASSET_ADDR string
}

func Load() Config {
	once.Do(func() {
		_ = godotenv.Load()

		config = Config{
			HTTP_ADDR:       getEnv("HTTP_ADDR"),
			GRPC_ASSET_ADDR: getEnv("GRPC_ASSET_ADDR"),
			POSTGRES_DSN:    getEnv("POSTGRES_DSN"),
			REDIS_URL:       getEnv("REDIS_URL"),
		}
	})

	return config
}

func getEnv(key string) string {
	if value, ok := os.LookupEnv(key); ok && value != "" {
		return value
	}
	return ""
}
