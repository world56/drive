// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package recycle

import (
	"context"

	"asset/api/internal/svc"
	"asset/api/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetRecyclesLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewGetRecyclesLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetRecyclesLogic {
	return &GetRecyclesLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetRecyclesLogic) GetRecycles() (resp *types.GetRecyclesResp, err error) {
	// todo: add your logic here and delete this line

	return
}
