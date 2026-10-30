package grpcserver

import (
	assetpb "api/asset"
	"asset/internal/service"
	"context"

	"google.golang.org/protobuf/types/known/emptypb"
)

type FavoriteGrpcServer struct {
	assetpb.UnimplementedFavoriteServiceServer
	favoriteService *service.FavoriteService
}

func newFavoriteGrpcServer(favoriteService *service.FavoriteService) *FavoriteGrpcServer {
	return &FavoriteGrpcServer{
		favoriteService: favoriteService,
	}
}

// 收藏排行
func (s *FavoriteGrpcServer) GetFavorite(c context.Context, e *emptypb.Empty) (*assetpb.Resources, error) {
	data, err := s.favoriteService.GetFavorite(c)
	if err != nil {
		return nil, err
	}

	return &assetpb.Resources{Data: data}, nil
}
