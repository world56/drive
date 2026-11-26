package storagelogic

import (
	"context"

	"storage/rpc/internal/svc"
	"storage/rpc/pb"

	"google.golang.org/protobuf/types/known/emptypb"

	"github.com/minio/minio-go/v7"
	"github.com/zeromicro/go-zero/core/logx"
)

type RemoveResourcesLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewRemoveResourcesLogic(ctx context.Context, svcCtx *svc.ServiceContext) *RemoveResourcesLogic {
	return &RemoveResourcesLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *RemoveResourcesLogic) RemoveResources(in *pb.ObjectNames) (*emptypb.Empty, error) {
	if len(in.IDs) == 0 {
		return &emptypb.Empty{}, nil
	}

	ch := make(chan minio.ObjectInfo, len(in.IDs))
	go func() {
		defer close(ch)
		for _, objectName := range in.IDs {
			ch <- minio.ObjectInfo{Key: objectName}
		}
	}()

	results := l.svcCtx.MinioClient.Client.RemoveObjects(l.ctx, l.svcCtx.Config.MINIO_BUCKET, ch, minio.RemoveObjectsOptions{})
	for result := range results {
		if result.Err != nil && minio.ToErrorResponse(result.Err).Code != minio.NoSuchKey {
			return nil, result.Err
		}
	}

	return &emptypb.Empty{}, nil
}
