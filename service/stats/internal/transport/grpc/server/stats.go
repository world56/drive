package grpcserver

import (
	statspb "api/stats"
	"context"
	"errors"
	"log"
	"stats/internal/service"

	"google.golang.org/protobuf/types/known/emptypb"
)

type StatsGrpcServer struct {
	statspb.UnimplementedStatsServiceServer
	statsServer *service.StatsService
}

func NewStatsGrpcServer(s *service.StatsService) *StatsGrpcServer {
	return &StatsGrpcServer{
		statsServer: s,
	}
}

func (s *StatsGrpcServer) Access(c context.Context, r *statspb.User) (*emptypb.Empty, error) {
	userID := r.GetId()
	if userID == "" {
		return &emptypb.Empty{}, errors.New("User ID must not be empty")
	}

	if err := s.statsServer.UpdateAccess(c, userID); err != nil {
		log.Fatalln(err)
		return &emptypb.Empty{}, err
	}

	return &emptypb.Empty{}, nil
}

func (s *StatsGrpcServer) Count(c context.Context, r *statspb.Resource) (*emptypb.Empty, error) {
	resourceType := r.GetType()
	resourceCount := r.GetCount()
	if err := s.statsServer.UpdateCount(c, resourceType, resourceCount); err != nil {
		return &emptypb.Empty{}, err
	}
	return &emptypb.Empty{}, nil
}
