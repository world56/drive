module gateway

go 1.26.4

require (
	common v0.0.0
	github.com/go-chi/chi/v5 v5.3.0
	github.com/go-chi/cors v1.2.1
	github.com/golang-jwt/jwt/v5 v5.3.1
	github.com/lmittmann/tint v1.2.1
	github.com/mattn/go-isatty v0.0.24
	github.com/redis/go-redis/v9 v9.21.0
)

require (
	github.com/cespare/xxhash/v2 v2.3.0 // indirect
	github.com/joho/godotenv v1.5.1 // indirect
	go.uber.org/atomic v1.11.0 // indirect
	golang.org/x/sys v0.41.0 // indirect
)

replace common => ../../common
