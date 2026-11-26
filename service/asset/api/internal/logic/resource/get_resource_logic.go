// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package resource

import (
	"context"

	"asset/api/internal/svc"
	"asset/api/internal/types"
	"asset/rpc/pb"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetResourceLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewGetResourceLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetResourceLogic {
	return &GetResourceLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetResourceLogic) GetResource(req *types.GetResourceReq) (resp *types.GetResourceResp, err error) {
	data, err := l.svcCtx.ResourceRpc.GetResource(l.ctx, &pb.GetResourceReq{Id: req.Id})
	if err != nil {
		return nil, err
	}

	return &types.GetResourceResp{
		CreatorName:   data.GetCreatorName(),
		Id:            data.Id,
		Name:          data.Name,
		FullName:      data.FullName,
		Size:          data.Size,
		Type:          data.Type,
		Suffix:        data.Suffix,
		ParentId:      data.ParentId,
		Remark:        data.Remark,
		Count:         data.Count,
		DownloadCount: data.DownloadCount,
		CreatorId:     data.CreatorId,
		CreateTime:    data.CreateTime,
		ObjectName:    data.ObjectName,
	}, nil
}
