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

func (l *GetFoldersLogic) GetFolders() (resp *types.ResourcesResp, err error) {
	folders, err := l.svcCtx.ResourceRpc.GetFolders(l.ctx, &emptypb.Empty{})
	if err != nil {
		return nil, err
	}

	list := make([]types.ResourceItem, 0, len(folders.List))
	for _, v := range folders.List {
		list = append(list, types.ResourceItem{
			Id:         v.Id,
			Name:       v.Name,
			FullName:   v.FullName,
			Size:       v.Size,
			Type:       int8(v.Type),
			Suffix:     v.Suffix,
			ParentId:   v.ParentId,
			Remark:     v.Remark,
			Count:      v.Count,
			CreatorId:  v.CreatorId,
			CreateTime: v.CreateTime,
			ObjectName: v.ObjectName,
		})
	}

	return &types.ResourcesResp{List: list}, nil
}
