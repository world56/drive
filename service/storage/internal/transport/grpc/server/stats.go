package grpcserver

import (
	statspb "api/storage"
	"context"
	"storage/internal/service"

	"google.golang.org/protobuf/types/known/emptypb"
)

type StatsGrpcService struct {
	statspb.UnimplementedStatsServiceServer
	statsServer *service.StatsService
}

func newStatsGrpcServer(s *service.StatsService) *StatsGrpcService {
	return &StatsGrpcService{
		statsServer: s,
	}
}

func (s *StatsGrpcService) GetSpaceUsage(c context.Context, _ *emptypb.Empty) (*statspb.SpaceUsage, error) {
	free, total, used, err := s.statsServer.GetSpaceUsage(c)
	if err != nil {
		return nil, err
	}

	return &statspb.SpaceUsage{
		Free:  free,
		Total: total,
		Used:  used,
	}, nil
}
