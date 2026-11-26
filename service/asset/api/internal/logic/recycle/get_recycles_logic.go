// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package recycle

import (
	"context"

	"asset/api/internal/svc"
	"asset/api/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
	"google.golang.org/protobuf/types/known/emptypb"
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
	recycles, err := l.svcCtx.RecycleRpc.GetRecycles(l.ctx, &emptypb.Empty{})
	if err != nil {
		return nil, err
	}

	list := make([]types.Recycle, 0, len(recycles.List))
	for _, val := range recycles.List {
		list = append(list, types.Recycle{
			Id:            val.Id,
			UserName:      val.UserName,
			ResourceId:    val.ResourceId,
			Remove:        val.Remove,
			CreateTime:    val.CreateTime,
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
			ObjectName:    val.ObjectName,
		})
	}

	return &types.GetRecyclesResp{List: list}, nil
}
