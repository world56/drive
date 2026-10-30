package grpcclient

import (
	assetpb "api/stats"
	"context"
	"log"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

type StatsGrpcClient struct {
	conn   *grpc.ClientConn
	client assetpb.StatsServiceClient
}

func newStatsGrpcClient(statsAddr string) (*StatsGrpcClient, error) {
	conn, err := grpc.NewClient(
		statsAddr,
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	)
	if err != nil {
		return nil, err
	}

	return &StatsGrpcClient{
		conn:   conn,
		client: assetpb.NewStatsServiceClient(conn),
	}, nil
}

func (s *StatsGrpcClient) Close() error {
	return s.conn.Close()
}

func (s *StatsGrpcClient) UpdateAssetCount(calculationType string, counts map[int8]int32) error {
	c, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	count := make(map[int32]int32, len(counts))
	for resourceType, n := range counts {
		count[int32(resourceType)] = n
	}

	_, err := s.client.Count(c, &assetpb.Resource{
		Calculation: calculationType,
		Count:       count,
	})
	if err != nil {
		log.Printf("stats count: %v", err)
	}
	return err
}
