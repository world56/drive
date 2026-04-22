package config

import (
	"os"
	"sync"

	"github.com/joho/godotenv"
)

var loadEnvOnce sync.Once

type Config struct {
	HTTPAddr    string
	PostgresDSN string
	RedisURL    string
	JWTSecret   string
}

func Load() Config {
	loadEnvOnce.Do(func() {
		// Best-effort local development support; production can inject env directly.
		_ = godotenv.Load()
	})

	return Config{
		HTTPAddr: getEnv("HTTP_ADDR", "0.0.0.0:9002"),
		PostgresDSN: getEnv(
			"POSTGRES_DSN",
			"host=localhost user=postgres password=Abc123456 dbname=drive port=5432 sslmode=disable TimeZone=Asia/Shanghai",
		),
		RedisURL:  getEnv("REDIS_URL", "redis://:slash@127.0.0.1:6379/1"),
		JWTSecret: getEnv("JWT_SECRET", "book-jwt-key"),
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok && value != "" {
		return value
	}
	return fallback
}
