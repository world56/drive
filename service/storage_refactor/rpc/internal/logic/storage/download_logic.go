package storagelogic

import (
	"context"

	resourceclient "asset/rpc/client/resource"
	logclient "auth/rpc/client/log"
	"common/ctxdata"
	utils "common/utils/jsonstring"
	"storage/rpc/internal/enum"
	"storage/rpc/internal/svc"
	"storage/rpc/pb"

	"github.com/zeromicro/go-zero/core/logx"
)

type DownloadLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewDownloadLogic(ctx context.Context, svcCtx *svc.ServiceContext) *DownloadLogic {
	return &DownloadLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *DownloadLogic) Download(in *pb.DownloadReq) (*pb.DownloadResp, error) {
	resource, err := l.svcCtx.AssetRpc.GetResource(l.ctx, &resourceclient.GetResourceReq{Id: in.Id})
	if err != nil {
		return nil, err
	}

	l.svcCtx.LogRpc.CreateLog(l.ctx, &logclient.CreateLogReq{
		OperatorId: ctxdata.UserInfo(l.ctx).Id,
		Desc:       utils.ToDescString(resource),
		Event:      enum.LogEventResourceDownload,
	})

	return &pb.DownloadResp{
		ObjectName: resource.GetObjectName(),
		FullName:   resource.GetFullName(),
	}, nil
}
