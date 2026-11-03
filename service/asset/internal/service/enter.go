package service

import (
	grpcclient "asset/internal/transport/grpc/client"
	rabbitmq "common/rabbitmq"

	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

type Service struct {
	LogService      *LogService
	RecycleService  *RecycleService
	ResourceService *ResourceService
	FavoriteService *FavoriteService
}

func NewService(db *gorm.DB, redis *redis.Client, grpcClient *grpcclient.GrpcClient, mq *rabbitmq.Client) *Service {
	logService := newLogService(mq)
	resourceService := newResourceService(db, redis, grpcClient, logService)
	favoriteService := newFavoriteService(db)

	return &Service{
		LogService:      logService,
		ResourceService: resourceService,
		FavoriteService: favoriteService,
		RecycleService:  newRecycleService(db, mq, logService, resourceService, favoriteService),
	}
}
