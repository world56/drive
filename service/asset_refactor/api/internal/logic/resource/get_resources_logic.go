// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package resource

import (
	"context"

	"asset/api/internal/svc"
	"asset/api/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetResourcesLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewGetResourcesLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetResourcesLogic {
	return &GetResourcesLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetResourcesLogic) GetResources(req *types.GetResourcesReq) (resp *types.ResourcesResp, err error) {
	// todo: add your logic here and delete this line

	return
}
