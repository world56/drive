package databases

import (
	"context"
	"log"
	"time"

	"github.com/redis/go-redis/v9"
)

func InitRedis(redisURL string) (*redis.Client, error) {
	add, err := redis.ParseURL(redisURL)
	if err != nil {
		log.Panic(err.Error())
		return nil, err
	}

	rdb := redis.NewClient(add)
	ctx, close := context.WithTimeout(context.Background(), 2*time.Second)
	defer close()

	_, pingErr := rdb.Ping(ctx).Result()
	if pingErr != nil {
		log.Panic(pingErr.Error())
		return nil, err
	}

	return rdb, nil
}
