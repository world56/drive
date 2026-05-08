package grpcserver

import (
	authpb "auth/internal/api/auth"
	"auth/internal/service"

	"google.golang.org/grpc"
)

func RegisterGrpcServers(s *grpc.Server, service *service.Server) {
	authpb.RegisterLogServiceServer(s, NewLogGrpcServer(service.LogService))
	authpb.RegisterUserServiceServer(s, NewUserGrpcServer(service.UserService))
}
