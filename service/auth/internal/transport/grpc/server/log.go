package grpcserver

import (
	authpb "api/auth"
	"auth/internal/dto"
	"auth/internal/service"
	"context"

	"google.golang.org/protobuf/types/known/emptypb"
)

type LogGrpcServer struct {
	authpb.UnimplementedLogServiceServer
	logService *service.LogService
}

func NewLogGrpcServer(s *service.LogService) *LogGrpcServer {
	return &LogGrpcServer{
		logService: s,
	}
}

func (s *LogGrpcServer) WriteLog(c context.Context, req *authpb.Log) (*emptypb.Empty, error) {
	if err := s.logService.WriteLog(c, &dto.WriteLog{
		Desc:   req.GetDesc(),
		Event:  req.GetEvent(),
		UserID: req.GetOperatorId(),
	}); err != nil {
		return &emptypb.Empty{}, err
	}
	return &emptypb.Empty{}, nil
}
