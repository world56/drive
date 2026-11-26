package favoritelogic

import (
	"context"

	"asset/rpc/internal/enum"
	"asset/rpc/internal/svc"
	"asset/rpc/pb"

	"google.golang.org/protobuf/types/known/emptypb"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetFavoriteTrendLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewGetFavoriteTrendLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetFavoriteTrendLogic {
	return &GetFavoriteTrendLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *GetFavoriteTrendLogic) GetFavoriteTrend(in *emptypb.Empty) (*pb.GetFavoritesResp, error) {
	db := l.svcCtx.DB.WithContext(l.ctx)
	var list []*pb.FavoriteInfo

	ranking := db.Table("favorites").
		Select("resource_id, COUNT(*) AS count").
		Group("resource_id").
		Order("count DESC").
		Limit(10)

	if err := db.Table("resources AS r").
		Select("r.id, r.full_name, r.type, r.parent_id").
		Joins("INNER JOIN (?) AS f ON f.resource_id = r.id", ranking).
		Where("r.remove = ?", enum.ResourceNormal).
		Order("f.count DESC").
		Scan(&list).Error; err != nil {
		return nil, err
	} else {
		return &pb.GetFavoritesResp{List: list}, nil
	}
}
