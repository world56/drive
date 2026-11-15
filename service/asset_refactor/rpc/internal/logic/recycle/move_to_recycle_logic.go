package recyclelogic

import (
	logclient "auth/rpc/client/log"
	utils "common/utils/jsonstring"
	"context"

	"asset/rpc/internal/enum"
	resourcelogic "asset/rpc/internal/logic/resource"
	"asset/rpc/internal/model"
	"asset/rpc/internal/svc"
	"asset/rpc/pb"
	"common/ctxdata"

	"google.golang.org/protobuf/types/known/emptypb"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"

	"github.com/zeromicro/go-zero/core/logx"
)

type MoveToRecycleLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewMoveToRecycleLogic(ctx context.Context, svcCtx *svc.ServiceContext) *MoveToRecycleLogic {
	return &MoveToRecycleLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *MoveToRecycleLogic) MoveToRecycle(in *pb.UpdateRecyclesReq) (*emptypb.Empty, error) {
	var affected []model.Resource
	operatorId := ctxdata.UserInfo(l.ctx).Id

	if err := l.svcCtx.DB.WithContext(l.ctx).Transaction(func(t *gorm.DB) error {
		resources := make([]model.Recycle, 0, len(in.Ids))
		for _, id := range in.Ids {
			resources = append(resources, model.Recycle{UserId: operatorId, ResourceId: id})
		}
		if err := t.Clauses(clause.OnConflict{DoNothing: true}).Create(&resources).Error; err != nil {
			return err
		}
		var err error
		resourceUpdate := resourcelogic.NewUpdateResourceLogic(l.ctx, l.svcCtx)
		affected, err = resourceUpdate.UpdateResourceStatus(l.ctx, t, in.Ids, enum.ResourceRecycled)
		return err
	}); err != nil {
		return nil, err
	}

	l.svcCtx.LogRpc.CreateLog(l.ctx, &logclient.CreateLogReq{
		OperatorId: operatorId,
		Desc:       utils.ToDescString(affected),
		Event:      enum.LogEventResourceToRecycle,
	})

	return &emptypb.Empty{}, nil
}
