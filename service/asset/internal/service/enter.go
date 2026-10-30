package service

import (
	grpcclient "asset/internal/transport/grpc/client"

	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

type Service struct {
	ResourceService *ResourceService
	FavoriteService *FavoriteService
}

func NewService(db *gorm.DB, redis *redis.Client, grpcClient *grpcclient.GrpcClient) *Service {
	return &Service{
		ResourceService: newResourceService(db, redis, grpcClient),
		FavoriteService: newFavoriteService(db),
	}
}
