// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package favorite

import (
	"context"

	"asset/api/internal/svc"
	"asset/api/internal/types"
	"asset/rpc/pb"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetFavoritesLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewGetFavoritesLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetFavoritesLogic {
	return &GetFavoritesLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetFavoritesLogic) GetFavorites(req *types.GetFavoritesReq) (resp *types.GetFavoritesResp, err error) {
	favorites, err := l.svcCtx.FavoriteRpc.GetFavorites(l.ctx, &pb.GetFavoritesReq{
		Type:       req.Type,
		FullName:   req.FullName,
		CreateTime: req.CreateTime,
	})
	if err != nil {
		return nil, err
	}

	list := make([]types.Favorite, 0, len(favorites.List))
	for _, val := range favorites.List {
		list = append(list, types.Favorite{
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
			ResourceId: val.ResourceId,
			Remove:     val.Remove,
		})
	}

	return &types.GetFavoritesResp{List: list}, nil
}
