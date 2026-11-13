package favoritelogic

import (
	"context"

	"asset/rpc/internal/model"
	"asset/rpc/internal/pkg/ctxdata"
	"asset/rpc/internal/svc"
	"asset/rpc/pb"

	"google.golang.org/protobuf/types/known/emptypb"
	"gorm.io/gorm/clause"

	"github.com/zeromicro/go-zero/core/logx"
)

type InsertFavoritesLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewInsertFavoritesLogic(ctx context.Context, svcCtx *svc.ServiceContext) *InsertFavoritesLogic {
	return &InsertFavoritesLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *InsertFavoritesLogic) InsertFavorites(in *pb.UpdateFavoritesReq) (*emptypb.Empty, error) {
	userId := ctxdata.OperatorId(l.ctx)
	favorites := make([]model.Favorite, 0, len(in.Ids))
	for _, id := range in.Ids {
		favorites = append(favorites, model.Favorite{
			ResourceId: id,
			UserId:     userId,
		})
	}

	if err := l.svcCtx.DB.WithContext(l.ctx).
		Clauses(clause.OnConflict{DoNothing: true}).
		Create(&favorites).Error; err != nil {
		return nil, err
	}

	return &emptypb.Empty{}, nil
}
