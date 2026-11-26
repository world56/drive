package resource

import (
	"context"

	"asset/api/internal/svc"
	"asset/api/internal/types"
	"asset/rpc/pb"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetResourceByObjectNameLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewGetResourceByObjectNameLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetResourceByObjectNameLogic {
	return &GetResourceByObjectNameLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetResourceByObjectNameLogic) GetResourceByObjectName(req *types.GetResourceByObjectNameReq) (any, error) {
	data, err := l.svcCtx.ResourceRpc.GetResourceByObjectName(l.ctx, &pb.GetResourceByObjectNameReq{
		ObjectName: req.ObjectName,
	})
	if err != nil {
		return nil, err
	}
	if data.GetId() == 0 {
		return struct{}{}, nil
	}

	return &types.GetResourceByObjectNameResp{ParentId: data.ParentId}, nil
}
