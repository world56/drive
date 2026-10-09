package grpcserver

import (
	statspb "api/stats"
	"stats/internal/service"

	"google.golang.org/grpc"
)

func RegisterGrpcServers(s grpc.ServiceRegistrar, svc *service.Service) {
	statspb.RegisterStatsServiceServer(s, NewStatsGrpcServer(svc.StatsService))
}
