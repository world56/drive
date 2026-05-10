package grpcserver

import (
	authpb "auth/internal/api/auth"
	"auth/internal/service"

	"google.golang.org/grpc"
)

func RegisterGrpcServers(s grpc.ServiceRegistrar, svc *service.Server) {
	authpb.RegisterLogServiceServer(s, NewLogGrpcServer(svc.LogService))
	authpb.RegisterUserServiceServer(s, NewUserGrpcServer(svc.UserService))
}
