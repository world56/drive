// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package resource

import (
	"context"

	"asset/api/internal/svc"
	"asset/api/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type SearchAllResourcesLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewSearchAllResourcesLogic(ctx context.Context, svcCtx *svc.ServiceContext) *SearchAllResourcesLogic {
	return &SearchAllResourcesLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *SearchAllResourcesLogic) SearchAllResources(req *types.SearchAllResourcesReq) (resp *types.ResourcesResp, err error) {
	// todo: add your logic here and delete this line

	return
}
