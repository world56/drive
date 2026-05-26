package databases

import (
	"context"
	"time"

	"github.com/redis/go-redis/v9"
)

func InitRedis(redisURL string) (*redis.Client, error) {
	address, err := redis.ParseURL(redisURL)
	if err != nil {
		return nil, err
	}

	rdb := redis.NewClient(address)

	ctx, close := context.WithTimeout(context.Background(), 2*time.Second)
	defer close()

	_, pingErr := rdb.Ping(ctx).Result()
	if pingErr != nil {
		return nil, err
	}

	return rdb, nil

}
