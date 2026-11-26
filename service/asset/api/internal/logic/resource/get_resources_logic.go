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
	resources, err := l.svcCtx.ResourceRpc.GetResources(l.ctx, &pb.GetResourcesReq{
		Id:    req.Id,
		Order: req.Order,
		Type:  req.Type,
	})
	if err != nil {
		return nil, err
	}

	list := make([]types.ResourceItem, 0, len(resources.List))
	for _, val := range resources.List {
		list = append(list, types.ResourceItem{
			Id:            val.Id,
			Name:          val.Name,
			FullName:      val.FullName,
			Size:          val.Size,
			Type:          val.Type,
			Suffix:        val.Suffix,
			ParentId:      val.ParentId,
			Remark:        val.Remark,
			Count:         val.Count,
			DownloadCount: val.DownloadCount,
			CreatorId:     val.CreatorId,
			CreateTime:    val.CreateTime,
			ObjectName:    val.ObjectName,
			Favorite:      val.GetFavorite(),
		})
	}

	return &types.ResourcesResp{List: list}, nil
}
