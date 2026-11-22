package favoritelogic

import (
	"context"

	"asset/rpc/internal/model"
	"asset/rpc/internal/svc"
	"asset/rpc/pb"
	"common/ctxdata"
	"errors"

	"google.golang.org/protobuf/types/known/emptypb"
	"gorm.io/gorm"

	"github.com/zeromicro/go-zero/core/logx"
)

type RemoveFavoritesLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewRemoveFavoritesLogic(ctx context.Context, svcCtx *svc.ServiceContext) *RemoveFavoritesLogic {
	return &RemoveFavoritesLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *RemoveFavoritesLogic) RemoveFavorites(in *pb.UpdateFavoritesReq) (*emptypb.Empty, error) {
	userId := ctxdata.UserInfo(l.ctx).Id
	if userId == 0 {
		return nil, errors.New("invalid user id")
	}
	if err := l.RemoveByUser(l.svcCtx.DB.WithContext(l.ctx), in.Ids, userId); err != nil {
		return nil, err
	}

	return &emptypb.Empty{}, nil
}

func (l *RemoveFavoritesLogic) RemoveByUser(tx *gorm.DB, ids []int64, userId int64) error {
	return tx.Where("resource_id IN ? AND user_id = ?", ids, userId).Delete(&model.Favorite{}).Error
}

func (l *RemoveFavoritesLogic) RemoveByIds(tx *gorm.DB, ids []int64) error {
	return tx.Where("resource_id IN ?", ids).Delete(&model.Favorite{}).Error
}
