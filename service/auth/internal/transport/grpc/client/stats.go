package grpcclient

import (
	statspb "api/stats"
	"context"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

type StatsGrpcClient struct {
	conn   *grpc.ClientConn
	client statspb.StatsServiceClient
}

func NewStatsGrpcClient(addr string) (*StatsGrpcClient, error) {
	conn, err := grpc.NewClient(
		addr,
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	)
	if err != nil {
		return nil, err
	}

	return &StatsGrpcClient{
		conn:   conn,
		client: statspb.NewStatsServiceClient(conn),
	}, nil
}

func (s *StatsGrpcClient) Close() error {
	return s.conn.Close()
}

func (s *StatsGrpcClient) Access(userID string) {
	go func(id string) {
		ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
		defer cancel()
		s.client.Access(ctx, &statspb.User{Id: userID})
	}(userID)
}
