// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package resource

import (
	"context"

	"asset/api/internal/svc"
	"asset/api/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
	"google.golang.org/protobuf/types/known/emptypb"
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

func (l *GetFoldersLogic) GetFolders() (resp *types.FoldersResp, err error) {
	folders, err := l.svcCtx.ResourceRpc.GetFolders(l.ctx, &emptypb.Empty{})
	if err != nil {
		return nil, err
	}

	list := make([]types.Folder, 0, len(folders.List))
	for _, v := range folders.List {
		list = append(list, types.Folder{
			Id:       v.Id,
			Name:     v.Name,
			Type:     v.Type,
			ParentId: v.ParentId,
		})
	}

	return &types.FoldersResp{List: list}, nil
}
