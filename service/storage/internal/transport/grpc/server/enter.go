package grpcserver

import (
	storagepb "api/storage"

	"storage/internal/service"

	"google.golang.org/grpc"
)

func RegisterGrpcServer(s grpc.ServiceRegistrar, svc *service.Service) {
	storagepb.RegisterStatsServiceServer(s, newStatsGrpcServer(svc.StatsService))
}
