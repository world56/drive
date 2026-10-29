package grpcclient

import (
	storagepb "api/storage"
	"context"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/protobuf/types/known/emptypb"
)

type StorageGrpcClient struct {
	conn  *grpc.ClientConn
	stats storagepb.StatsServiceClient
}

func newStorageGrpcClient(storageAddr string) (*StorageGrpcClient, error) {
	conn, err := grpc.NewClient(
		storageAddr,
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	)
	if err != nil {
		return nil, err
	}

	return &StorageGrpcClient{
		conn:  conn,
		stats: storagepb.NewStatsServiceClient(conn),
	}, nil
}

func (s *StorageGrpcClient) Close() error {
	return s.conn.Close()
}

func (s *StorageGrpcClient) GetSpaceUsage() (*storagepb.SpaceUsage, error) {
	c, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	return s.stats.GetSpaceUsage(c, &emptypb.Empty{})
}
