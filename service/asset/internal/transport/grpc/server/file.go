package grpcserver

import (
	assetpb "api/asset"
	"asset/internal/service"
	"context"

	"google.golang.org/grpc/metadata"
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
	header, ok := metadata.FromIncomingContext(c)
	if !ok {
		return nil, nil
	}
	userID := header["user-id"][0]

	s.fileService.InsertFile(c, userID, req.GetName(), req.GetObjectName(), req.GetParentID(), req.GetSize())
	return &emptypb.Empty{}, nil
}
