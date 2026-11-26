module gateway

go 1.26.4

require (
	common v0.0.0
	github.com/go-chi/chi/v5 v5.3.0
	github.com/go-chi/cors v1.2.1
	github.com/golang-jwt/jwt/v5 v5.3.1
	github.com/lmittmann/tint v1.2.1
	github.com/mattn/go-isatty v0.0.24
	github.com/redis/go-redis/v9 v9.22.0
	github.com/zeromicro/go-zero v1.11.0
)

require (
	github.com/cespare/xxhash/v2 v2.3.0 // indirect
	github.com/fatih/color v1.19.0 // indirect
	github.com/kr/text v0.2.0 // indirect
	github.com/mattn/go-colorable v0.1.15 // indirect
	github.com/pelletier/go-toml/v2 v2.4.3 // indirect
	github.com/spaolacci/murmur3 v1.1.0 // indirect
	github.com/titanous/json5 v1.0.0 // indirect
	go.opentelemetry.io/otel v1.46.0 // indirect
	go.opentelemetry.io/otel/trace v1.46.0 // indirect
	go.uber.org/atomic v1.11.0 // indirect
	go.uber.org/automaxprocs v1.6.0 // indirect
	golang.org/x/sys v0.48.0 // indirect
	gopkg.in/yaml.v2 v2.4.0 // indirect
)

replace common => ../../common
