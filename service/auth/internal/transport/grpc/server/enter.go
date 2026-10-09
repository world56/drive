package grpcserver

import (
	authpb "api/auth"
	"auth/internal/service"

	"google.golang.org/grpc"
)

func RegisterGrpcServers(s grpc.ServiceRegistrar, svc *service.Service) {
	authpb.RegisterLogServiceServer(s, NewLogGrpcServer(svc.LogService))
	authpb.RegisterUserServiceServer(s, NewUserGrpcServer(svc.UserService))
}
