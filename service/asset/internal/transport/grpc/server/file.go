package grpcserver

import (
	assetpb "api/asset"
	"asset/internal/service"
	"context"
	"fmt"

	"google.golang.org/protobuf/types/known/emptypb"
)

type FileGrpcServer struct {
	assetpb.UnimplementedFileServiceServer
	fileService *service.FileService
}

func newFileGrpcServer(s *service.FileService) *FileGrpcServer {
	return &FileGrpcServer{
		fileService: s,
	}
}

func (s *FileGrpcServer) WriteDone(c context.Context, req *assetpb.File) (*emptypb.Empty, error) {
	fmt.Println("@-GetID", req.GetID())
	fmt.Println("@-GetObjectName", req.GetObjectName())
	fmt.Println("@-GetParentID", req.GetParentID())
	return &emptypb.Empty{}, nil
}
