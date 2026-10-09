package app

import (
	grpcserver "auth/internal/transport/grpc/server"
	"net"

	"google.golang.org/grpc"
)

func (a *App) RunGRPC() error {
	lis, err := net.Listen("tcp", a.Config.GRPC_ADDR)
	if err != nil {
		return err
	}

	grpcServer := grpc.NewServer()

	grpcserver.RegisterGrpcServers(grpcServer, a.Service)

	return grpcServer.Serve(lis)
}
