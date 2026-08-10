package grpcserver

import (
	assetpb "api/asset"
	"asset/internal/dto"
	"asset/internal/service"
	"context"
	"strconv"

	"google.golang.org/grpc/metadata"
	"google.golang.org/protobuf/types/known/emptypb"
)

type FileGrpcServer struct {
	assetpb.UnimplementedResourceServiceServer
	resourceService *service.ResourceService
}

func newResourceGrpcServer(s *service.ResourceService) *FileGrpcServer {
	return &FileGrpcServer{
		resourceService: s,
	}
}

func (s *FileGrpcServer) WriteDone(c context.Context, req *assetpb.Resource) (*emptypb.Empty, error) {
	header, ok := metadata.FromIncomingContext(c)
	if !ok {
		return nil, nil
	}
	creatorID := header["user-id"][0]

	s.resourceService.InsertResource(c, creatorID, req.GetName(), req.GetObjectName(), req.ParentID, req.GetSize())
	return &emptypb.Empty{}, nil
}

func (s *FileGrpcServer) GetResourceInfo(c context.Context, req *assetpb.ResourcePrimaryID) (*assetpb.Resource, error) {
	id, err := strconv.ParseInt(req.GetID(), 10, 64)
	if err != nil {
		return nil, err
	}

	if resource, err := s.resourceService.GetResourceDetail(c, dto.RequestResourceDetail{ID: id}); err != nil {
		return nil, err
	} else {
		return &assetpb.Resource{
			ID:         resource.ID,
			Name:       resource.Name,
			Size:       resource.Size,
			ParentID:   resource.ParentID,
			FullName:   &resource.FullName,
			ObjectName: resource.ObjectName,
		}, nil
	}
}
