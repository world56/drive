package config

import (
	"common/env"
)

type Route struct {
	Prefix    string
	Upstream  string
	Auth      bool
	Whitelist []string
}

type Config struct {
	HTTP_ADDR        string
	APP_ENV          string
	REDIS_URL        string
	JWT_SECRET       string
	UPSTREAM_AUTH    string
	UPSTREAM_ASSET   string
	UPSTREAM_STATS   string
	UPSTREAM_STORAGE string
}

func Load() Config {
	env.LoadEnv()

	return Config{
		HTTP_ADDR:        env.GetEnv("HTTP_ADDR"),
		APP_ENV:          env.GetEnv("APP_ENV"),
		REDIS_URL:        env.GetEnv("REDIS_URL"),
		JWT_SECRET:       env.GetEnv("JWT_SECRET"),
		UPSTREAM_AUTH:    env.GetEnv("UPSTREAM_AUTH"),
		UPSTREAM_ASSET:   env.GetEnv("UPSTREAM_ASSET"),
		UPSTREAM_STATS:   env.GetEnv("UPSTREAM_STATS"),
		UPSTREAM_STORAGE: env.GetEnv("UPSTREAM_STORAGE"),
	}
}

func (c Config) IsLocal() bool {
	switch c.APP_ENV {
	case "", "local", "dev", "development":
		return true
	default:
		return false
	}
}

func (c Config) Routes() []Route {
	return []Route{
		{
			Prefix:   "/api/auth",
			Upstream: c.UPSTREAM_AUTH,
			Auth:     true,
			Whitelist: []string{
				"/api/auth/crypto",
				"/api/auth/account/login",
				"/api/auth/account/super",
				"/api/auth/account/logout",
				"/api/auth/account/register",
			},
		},
		{Prefix: "/api/explorer", Upstream: c.UPSTREAM_ASSET, Auth: true},
		{Prefix: "/api/favorite", Upstream: c.UPSTREAM_ASSET, Auth: true},
		{Prefix: "/api/recovery", Upstream: c.UPSTREAM_ASSET, Auth: true},
		{Prefix: "/api/stats", Upstream: c.UPSTREAM_STATS, Auth: true},
		{Prefix: "/api/storage", Upstream: c.UPSTREAM_STORAGE, Auth: true},
	}
}
