package resourcelogic

import (
	"context"
	"strconv"

	"asset/rpc/internal/enum"
	"asset/rpc/internal/model"
	"asset/rpc/internal/svc"
	"asset/rpc/pb"
	logclient "auth/rpc/client/log"
	"common/ctxdata"
	"common/databases"
	utils "common/utils/jsonstring"

	"google.golang.org/protobuf/types/known/emptypb"
	"gorm.io/gorm"

	"github.com/zeromicro/go-zero/core/logx"
)

type MoveResourcesLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewMoveResourcesLogic(ctx context.Context, svcCtx *svc.ServiceContext) *MoveResourcesLogic {
	return &MoveResourcesLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *MoveResourcesLogic) MoveResources(in *pb.MoveResourcesReq) (*emptypb.Empty, error) {
	var items []model.Resource

	err := l.svcCtx.DB.WithContext(l.ctx).Transaction(func(t *gorm.DB) error {
		if err := t.Where("id IN ?", in.Ids).Find(&items).Error; err != nil {
			return err
		}

		for _, item := range items {
			for i := 1; i <= 64; i++ {
				name := item.Name
				if i > 1 {
					name = name + " " + strconv.Itoa(i)
				}
				fullName := name
				if item.Type != enum.ResourceTypeFolder && item.Suffix != nil && *item.Suffix != "" {
					fullName = name + "." + *item.Suffix
				}

				eventID := "sp_" + strconv.FormatInt(item.Id, 10) + "_" + strconv.Itoa(i)
				if err := t.SavePoint(eventID).Error; err != nil {
					return err
				}

				err := t.Model(&model.Resource{}).
					Where("id = ?", item.Id).
					Updates(map[string]interface{}{
						"name":      name,
						"full_name": fullName,
						"parent_id": in.ParentId,
					}).Error

				if err == nil {
					break
				}
				if !databases.IsUniqueViolation(err) {
					return err
				}

				if err := t.RollbackTo(eventID).Error; err != nil {
					return err
				}
			}
		}
		return nil
	})

	if err != nil {
		return nil, err
	}

	var moved []model.Resource
	if err := l.svcCtx.DB.
		WithContext(l.ctx).
		Where("id IN ?", in.Ids).
		Find(&moved).Error; err == nil {
		l.svcCtx.LogRpc.CreateLog(l.ctx, &logclient.CreateLogReq{
			Event:      enum.LogEventResourceMove,
			Desc:       utils.ToDescString(moved),
			OperatorId: ctxdata.UserInfo(l.ctx).Id,
		})
	}

	return &emptypb.Empty{}, nil
}
