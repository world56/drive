package databases

import (
	"context"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

func InitReds(redisURL string) (*redis.Client, error) {
	address, err := redis.ParseURL(redisURL)
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
		return nil, pingErr
	}

	return rdb, nil
}
