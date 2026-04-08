package databases

import (
	"context"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

func InitReds() (*redis.Client, error) {
	address, err := redis.ParseURL("redis://:slash@127.0.0.1:6379/1")
	if err != nil {
		fmt.Printf("err-redis-url %v", err.Error())
		return nil, err
	}

	rdb := redis.NewClient(address)

	ctx, close := context.WithTimeout(context.Background(), 2*time.Second)
	defer close()

	_, pingErr := rdb.Ping(ctx).Result()
	if pingErr != nil {
		fmt.Printf("error-redis-ping %v", pingErr.Error())
		return nil, err
	}

	return rdb, nil
}
