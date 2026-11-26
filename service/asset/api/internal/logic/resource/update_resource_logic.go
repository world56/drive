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

type UpdateResourceLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewUpdateResourceLogic(ctx context.Context, svcCtx *svc.ServiceContext) *UpdateResourceLogic {
	return &UpdateResourceLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *UpdateResourceLogic) UpdateResource(req *types.UpdateResourceReq) error {
	_, err := l.svcCtx.ResourceRpc.UpdateResource(l.ctx, &pb.UpdateResourceReq{
		Id:       req.Id,
		Name:     req.Name,
		Remark:   req.Remark,
		ParentId: req.ParentId,
	})

	return err
}
