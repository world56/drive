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
	resources, err := l.svcCtx.ResourceRpc.GetSearchResources(l.ctx, &pb.GetSearchResourcesReq{
		Name:      req.Name,
		Type:      req.Type,
		Sort:      req.Sort,
		EndTime:   req.EndTime,
		StartTime: req.StartTime,
	})
	if err != nil {
		return nil, err
	}

	list := make([]types.ResourceItem, 0, len(resources.List))
	for _, val := range resources.List {
		list = append(list, types.ResourceItem{
			Id:         val.Id,
			Name:       val.Name,
			FullName:   val.FullName,
			Size:       val.Size,
			Type:       val.Type,
			Suffix:     val.Suffix,
			ParentId:   val.ParentId,
			Remark:     val.Remark,
			Count:      val.Count,
			CreatorId:  val.CreatorId,
			CreateTime: val.CreateTime,
			ObjectName: val.ObjectName,
		})
	}

	return &types.ResourcesResp{List: list}, nil
}
