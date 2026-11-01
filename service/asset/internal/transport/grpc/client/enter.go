package grpcclient

type GrpcClient struct {
	Stats *StatsGrpcClient
	Auth  *AuthGrpcClient
}

func NewGrpcClient(statsAddr, authAddr string) (*GrpcClient, error) {
	stats, err := newStatsGrpcClient(statsAddr)
	if err != nil {
		return nil, err
	}

	auth, err := newAuthGrpcClient(authAddr)
	if err != nil {
		return nil, err
	}

	return &GrpcClient{
		Stats: stats,
		Auth:  auth,
	}, nil
}

func (g *GrpcClient) Close() {
	if g.Stats != nil {
		g.Stats.Close()
	}

	if g.Auth != nil {
		g.Auth.Close()
	}
}
