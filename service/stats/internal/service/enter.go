package service

import (
	grpcclient "stats/internal/transport/grpc/client"

	"github.com/redis/go-redis/v9"
)

type Service struct {
	StatsService *StatsService
}

func NewService(redis *redis.Client, grpcClient *grpcclient.GrpcClient) *Service {
	return &Service{
		StatsService: newStatsService(redis, grpcClient),
	}
}
