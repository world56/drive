package grpcserver

import (
	authpb "auth/internal/api/auth"
	"auth/internal/dto"
	"auth/internal/service"
	"context"

	"github.com/golang/protobuf/ptypes/empty"
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

func (s *LogGrpcServer) WriteLog(c context.Context, req *authpb.Log) (*empty.Empty, error) {
	if err := s.logService.WriteLog(c, &dto.WriteLog{
		Desc:   req.GetDesc(),
		Event:  req.GetEvent(),
		UserID: req.GetOperatorId(),
	}); err != nil {
		return &empty.Empty{}, err
	}
	return &empty.Empty{}, nil
}
