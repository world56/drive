package favoritelogic

import (
	"context"

	"asset/rpc/internal/enum"
	"asset/rpc/internal/svc"
	"asset/rpc/pb"
	"common/ctxdata"
	"errors"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetFavoritesLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewGetFavoritesLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetFavoritesLogic {
	return &GetFavoritesLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *GetFavoritesLogic) GetFavorites(in *pb.GetFavoritesReq) (*pb.GetFavoritesResp, error) {
	userID := ctxdata.UserInfo(l.ctx).Id
	if userID == 0 {
		return nil, errors.New("invalid user id")
	}

	order := enum.SortDesc
	if in.CreateTime == enum.SortAsc {
		order = enum.SortAsc
	}

	db := l.svcCtx.DB.WithContext(l.ctx).
		Table("favorites AS f").
		Select(`
				f.id,
				f.resource_id,
				to_char(f.create_time, 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"') AS create_time,
				r.name,
				r.full_name,
				r.type,
				r.size,
				r.suffix,
				r.object_name,
				r.remove,
				r.parent_id,
				r.remark,
				r.creator_id,
				r.download_count,
				(
					SELECT COUNT(*)
					FROM resources AS c
					WHERE c.parent_id = r.id AND c.remove = ?
				) AS count
	`, enum.ResourceNormal).
		Joins("INNER JOIN resources AS r ON r.id = f.resource_id").
		Where("f.user_id = ?", userID).
		Where("r.remove = ?", enum.ResourceNormal).
		Order("f.create_time " + order)

	if in.FullName != "" {
		db = db.Where("r.full_name LIKE ?", "%"+in.FullName+"%")
	}
	if len(in.Type) > 0 {
		db = db.Where("r.type IN ?", in.Type)
	}

	var list []*pb.FavoriteInfo
	if err := db.Scan(&list).Error; err != nil {
		return nil, err
	}

	return &pb.GetFavoritesResp{List: list}, nil
}
