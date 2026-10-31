package service

import (
	grpcclient "asset/internal/transport/grpc/client"

	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

type Service struct {
	RecycleService  *RecycleService
	ResourceService *ResourceService
	FavoriteService *FavoriteService
}

func NewService(db *gorm.DB, redis *redis.Client, grpcClient *grpcclient.GrpcClient) *Service {
	resourceService := newResourceService(db, redis, grpcClient)

	return &Service{
		ResourceService: resourceService,
		FavoriteService: newFavoriteService(db),
		RecycleService:  newRecycleService(db, resourceService),
	}
}
