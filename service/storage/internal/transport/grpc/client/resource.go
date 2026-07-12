package grpcclient

import (
	assetpb "api/asset"
	"context"
	"storage/internal/dto"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/metadata"
)

type ResourceGrpcClient struct {
	conn   *grpc.ClientConn
	client assetpb.ResourceServiceClient
}

func newResourceGrpcClient(assetAddr string) (*ResourceGrpcClient, error) {
	conn, err := grpc.NewClient(
		assetAddr,
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	)
	if err != nil {
		return nil, err
	}

	return &ResourceGrpcClient{
		conn:   conn,
		client: assetpb.NewResourceServiceClient(conn),
	}, nil
}

func (s *ResourceGrpcClient) Close() error {
	return s.conn.Close()
}

func (s *ResourceGrpcClient) WriteDone(info dto.File, userID string) {
	c, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	c = metadata.AppendToOutgoingContext(c, "user-id", userID)
	s.client.WriteDone(c, &assetpb.Resource{
		ID:         info.ID,
		Name:       info.Name,
		ParentID:   info.ParentID,
		ObjectName: info.ObjectName,
		Size:       info.Size,
	})
}
