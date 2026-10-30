package grpcclient

import (
	assetpb "api/asset"
	"context"
	"stats/internal/dto"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/protobuf/types/known/emptypb"
)

type AssetGrpcClient struct {
	conn     *grpc.ClientConn
	resource assetpb.ResourceServiceClient
	favorite assetpb.FavoriteServiceClient
}

func newAssetGrpcClient(assetAddr string) (*AssetGrpcClient, error) {
	conn, err := grpc.NewClient(assetAddr, grpc.WithTransportCredentials(
		insecure.NewCredentials(),
	))
	if err != nil {
		return nil, err
	}

	return &AssetGrpcClient{
		conn:     conn,
		resource: assetpb.NewResourceServiceClient(conn),
		favorite: assetpb.NewFavoriteServiceClient(conn),
	}, nil
}

func (a *AssetGrpcClient) GetRecently(c context.Context, _ *emptypb.Empty) ([]dto.ResponseResourceSort, error) {
	c, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	data, err := a.resource.GetRecently(c, &emptypb.Empty{})
	if err != nil {
		return nil, err
	}

	list := make([]dto.ResponseResourceSort, 0, len(data.Data))
	for _, v := range data.Data {
		list = append(list, dto.ResponseResourceSort{
			ID:       v.GetID(),
			FullName: v.GetFullName(),
			Type:     v.GetType(),
			ParentID: v.ParentID,
		})
	}

	return list, nil
}

func (a *AssetGrpcClient) GetFavorite(c context.Context, _ *emptypb.Empty) ([]dto.ResponseResourceSort, error) {
	c, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	data, err := a.favorite.GetFavorite(c, &emptypb.Empty{})
	if err != nil {
		return nil, err
	}

	list := make([]dto.ResponseResourceSort, 0, len(data.Data))
	for _, v := range data.Data {
		list = append(list, dto.ResponseResourceSort{
			ID:       v.GetID(),
			FullName: v.GetFullName(),
			Type:     v.GetType(),
			ParentID: v.ParentID,
		})
	}

	return list, nil
}

func (a *AssetGrpcClient) GetCount(c context.Context, _ *emptypb.Empty) (*dto.StorageCountDetails, error) {
	data, err := a.resource.GetCount(c, &emptypb.Empty{})
	if err != nil {
		return nil, err
	}

	return (*dto.StorageCountDetails)(&data.Count), nil
}
