package grpcclient

type GrpcClient struct {
	Stats *StatsGrpcClient
}

func NewGrpcClients(statsAddr string) (*GrpcClient, error) {
	stats, err := newStatsGrpcClient(statsAddr)
	if err != nil {
		return nil, err
	}

	return &GrpcClient{
		Stats: stats,
	}, nil
}

func (g *GrpcClient) Close() {
	if g.Stats != nil {
		g.Stats.Close()
	}
}
