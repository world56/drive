package service

import (
	"asset/internal/pkg/mq"
	grpcclient "asset/internal/transport/grpc/client"

	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

type Service struct {
	RecycleService  *RecycleService
	ResourceService *ResourceService
	FavoriteService *FavoriteService
}

func NewService(db *gorm.DB, redis *redis.Client, grpcClient *grpcclient.GrpcClient, rabbitmq *mq.Client) *Service {
	resourceService := newResourceService(db, redis, grpcClient)
	favoriteService := newFavoriteService(db)

	return &Service{
		ResourceService: resourceService,
		FavoriteService: favoriteService,
		RecycleService:  newRecycleService(db, rabbitmq, resourceService, favoriteService),
	}
}
