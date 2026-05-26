package service

import "github.com/redis/go-redis/v9"

type StatsService struct {
	redis *redis.Client
}

func NewStatsService(redis *redis.Client) *StatsService {
	return &StatsService{
		redis: redis,
	}
}
