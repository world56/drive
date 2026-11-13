package recyclelogic

import (
	logclient "auth/rpc/client/log"
	utils "common/utils/jsonstring"
	"context"

	"asset/rpc/internal/enum"
	resourcelogic "asset/rpc/internal/logic/resource"
	"asset/rpc/internal/model"
	"asset/rpc/internal/pkg/ctxdata"
	"asset/rpc/internal/svc"
	"asset/rpc/pb"

	"google.golang.org/protobuf/types/known/emptypb"
	"gorm.io/gorm"

	"github.com/zeromicro/go-zero/core/logx"
)

type RestoreRecycleResourcesLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewRestoreRecycleResourcesLogic(ctx context.Context, svcCtx *svc.ServiceContext) *RestoreRecycleResourcesLogic {
	return &RestoreRecycleResourcesLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *RestoreRecycleResourcesLogic) RestoreRecycleResources(in *pb.UpdateRecyclesReq) (*emptypb.Empty, error) {
	var affected []model.Resource
	operatorId := ctxdata.OperatorId(l.ctx)

	if err := l.svcCtx.DB.WithContext(l.ctx).Transaction(func(t *gorm.DB) error {
		if err := t.Where("resource_id IN ? AND user_id = ?", in.Ids, operatorId).Delete(&model.Recycle{}).Error; err != nil {
			return err
		}
		var err error
		resourceUpdate := resourcelogic.NewUpdateResourceLogic(l.ctx, l.svcCtx)
		affected, err = resourceUpdate.UpdateResourceStatus(l.ctx, t, in.Ids, enum.ResourceNormal)
		return err
	}); err != nil {
		return nil, err
	}

	l.svcCtx.LogRpc.CreateLog(l.ctx, &logclient.CreateLogReq{
		OperatorId: operatorId,
		Desc:       utils.ToDescString(affected),
		Event:      enum.LogEventRecycleBinRecovery,
	})
	return &emptypb.Empty{}, nil
}
