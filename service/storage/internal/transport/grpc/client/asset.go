package grpcclient

import (
	assetpb "api/asset"
	"context"
	"storage/internal/dto"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

type AssetGrpcClient struct {
	conn   *grpc.ClientConn
	client assetpb.FileServiceClient
}

func newAssetGrpcClient(assetAddr string) (*AssetGrpcClient, error) {
	conn, err := grpc.NewClient(
		assetAddr,
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	)
	if err != nil {
		return nil, err
	}

	return &AssetGrpcClient{
		conn:   conn,
		client: assetpb.NewFileServiceClient(conn),
	}, nil
}

func (s *AssetGrpcClient) Close() error {
	return s.conn.Close()
}

func (s *AssetGrpcClient) WriteDone(info dto.File) {
	go func(info dto.File) {
		c, cancel := context.WithTimeout(context.Background(), 2*time.Second)
		defer cancel()
		s.client.WriteDone(c, &assetpb.File{
			ID:         info.ID,
			Name:       info.Name,
			ParentID:   info.ParentID,
			ObjectName: info.ObjectName,
			Size:       info.Size,
		})
	}(info)
}
