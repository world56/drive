package service

import "github.com/redis/go-redis/v9"

type Service struct {
	StatsService *StatsService
}

func NewService(redis *redis.Client) *Service {
	return &Service{
		StatsService: NewStatsService(redis),
	}
}
