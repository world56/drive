package grpcserver

import (
	assetpb "api/asset"
	"asset/internal/service"
	"context"

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
	s.fileService.InsertFile(c, req.GetName(), req.GetObjectName(), req.GetParentID(), req.GetSize())
	return &emptypb.Empty{}, nil
}
