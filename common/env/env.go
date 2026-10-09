package env

import (
	"os"
	"sync"

	"github.com/joho/godotenv"
)

var loadOnce sync.Once

// 初始化加载
func LoadEnv() {
	loadOnce.Do(func() {
		_ = godotenv.Load()
	})
}

// 取出环境变量
func GetEnv(key string) string {
	if value, ok := os.LookupEnv(key); ok && value != "" {
		return value
	}
	return ""
}
