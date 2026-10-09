package grpcclient

type GrpcClients struct {
	Stats *StatsGrpcClient
}

func NewGrpcClients(statsAddr string) (*GrpcClients, error) {
	stats, err := NewStatsGrpcClient(statsAddr)
	if err != nil {
		return nil, err
	}

	return &GrpcClients{
		Stats: stats,
	}, nil
}

func (s *GrpcClients) Close() error {
	if s.Stats != nil {
		return s.Stats.Close()
	}

	return nil
}
