package grpcserver

import (
	assetpb "api/asset"
	"asset/internal/dto"
	"asset/internal/service"
	"context"
	"strconv"

	"google.golang.org/protobuf/types/known/emptypb"
)

type ResourceGrpcServer struct {
	assetpb.UnimplementedResourceServiceServer
	resourceService *service.ResourceService
}

func newResourceGrpcServer(s *service.ResourceService) *ResourceGrpcServer {
	return &ResourceGrpcServer{
		resourceService: s,
	}
}

// // 资源上传完成，入表
// func (s *ResourceGrpcServer) WriteDone(c context.Context, req *assetpb.Resource) (*assetpb.Resource, error) {
// 	header, ok := metadata.FromIncomingContext(c)
// 	if !ok {
// 		return nil, nil
// 	}
// 	creatorID := header["user-id"][0]

// 	resource, err := s.resourceService.InsertResource(c, creatorID, req.GetName(), req.GetObjectName(), req.ParentID, req.GetSize(), req.GetPath())
// 	if err != nil {
// 		return nil, err
// 	}

// 	return &assetpb.Resource{
// 		ID:         resource.ID,
// 		Name:       resource.Name,
// 		Size:       resource.Size,
// 		ParentID:   resource.ParentID,
// 		FullName:   &resource.FullName,
// 		ObjectName: resource.ObjectName,
// 	}, nil
// }

// 资源详情
func (s *ResourceGrpcServer) GetResourceInfo(c context.Context, req *assetpb.ResourcePrimaryID) (*assetpb.Resource, error) {
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

// 获取最近上传
func (s *ResourceGrpcServer) GetRecently(c context.Context, e *emptypb.Empty) (*assetpb.Resources, error) {
	data, err := s.resourceService.GetRecently(c)
	if err != nil {
		return nil, err
	}

	return &assetpb.Resources{Data: data}, nil
}

func (s *ResourceGrpcServer) GetCount(c context.Context, e *emptypb.Empty) (*assetpb.Count, error) {
	data, err := s.resourceService.GetResourceTypeCount(c)
	if err != nil {
		return nil, err
	}

	count := make(map[string]int64, len(data))
	for _, item := range data {
		count[strconv.Itoa(int(item.Type))] = item.Count
	}

	return &assetpb.Count{Count: count}, nil
}
