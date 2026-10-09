package grpcserver

import (
	assethb "api/asset"
	"asset/internal/service"

	"google.golang.org/grpc"
)

func RegisterGrpcServers(s grpc.ServiceRegistrar, svc *service.Service) {
	assethb.RegisterResourceServiceServer(s, newResourceGrpcServer(svc.ResourceService))
}
