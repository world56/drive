// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package resource

import (
	"context"

	"asset/api/internal/svc"
	"asset/api/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetFoldersLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewGetFoldersLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetFoldersLogic {
	return &GetFoldersLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetFoldersLogic) GetFolders() (resp *types.ResourcesResp, err error) {
	// todo: add your logic here and delete this line

	return
}
