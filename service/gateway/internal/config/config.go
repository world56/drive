package config

import "strconv"

type Route struct {
	Prefix    string
	Upstream  string
	Auth      bool
	Whitelist []string
}

type Upstream struct {
	Auth    string
	Asset   string
	Stats   string
	Storage string
}

type Config struct {
	Name      string
	Host      string
	Port      int
	Mode      string
	RedisUrl  string
	JwtSecret string
	Upstream  Upstream
}

func (c Config) Addr() string {
	return c.Host + ":" + strconv.Itoa(c.Port)
}

func (c Config) IsLocal() bool {
	switch c.Mode {
	case "", "local", "dev", "development", "test":
		return true
	default:
		return false
	}
}

func (c Config) Routes() []Route {
	return []Route{
		{
			Prefix:   "/api/auth",
			Upstream: c.Upstream.Auth,
			Auth:     true,
			Whitelist: []string{
				"/api/auth/crypto",
				"/api/auth/account/login",
				"/api/auth/account/super",
				"/api/auth/account/register",
			},
		},
		{Prefix: "/api/asset", Upstream: c.Upstream.Asset, Auth: true},
		{Prefix: "/api/stats", Upstream: c.Upstream.Stats, Auth: true},
		{Prefix: "/api/storage", Upstream: c.Upstream.Storage, Auth: true},
	}
}
