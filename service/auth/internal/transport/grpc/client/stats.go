package grpcclient

import (
	statspb "auth/internal/api/stats"
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

func (s *StatsGrpcClient) Access(c context.Context, userID string) error {
	ctx, cancel := context.WithTimeout(c, 2*time.Second)
	defer cancel()

	_, err := s.client.Access(ctx, &statspb.User{Id: userID})
	return err
}
