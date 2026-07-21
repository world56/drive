package grpcserver

import (
	assetpb "api/asset"
	"asset/internal/service"
	"context"

	"google.golang.org/grpc/metadata"
	"google.golang.org/protobuf/types/known/emptypb"
)

type FileGrpcServer struct {
	assetpb.UnimplementedResourceServiceServer
	fileService *service.ResourceService
}

func newResourceGrpcServer(s *service.ResourceService) *FileGrpcServer {
	return &FileGrpcServer{
		fileService: s,
	}
}

func (s *FileGrpcServer) WriteDone(c context.Context, req *assetpb.Resource) (*emptypb.Empty, error) {
	header, ok := metadata.FromIncomingContext(c)
	if !ok {
		return nil, nil
	}
	creatorID := header["user-id"][0]

	s.fileService.InsertResource(c, creatorID, req.GetName(), req.GetObjectName(), req.ParentID, req.GetSize())
	return &emptypb.Empty{}, nil
}
