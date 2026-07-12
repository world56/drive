package grpcserver

import (
	assetpb "api/asset"
	"asset/internal/service"
	"context"

	"github.com/google/uuid"
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
	creatorID, err := uuid.Parse(header["user-id"][0])
	if err != nil {
		return &emptypb.Empty{}, err
	}

	s.fileService.InsertFile(c, creatorID, req.GetName(), req.GetObjectName(), req.ParentID, req.GetSize())
	return &emptypb.Empty{}, nil
}
