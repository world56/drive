package resourcelogic

import (
	"context"

	"asset/rpc/internal/enum"
	"asset/rpc/internal/svc"
	"asset/rpc/pb"
	"common/ctxdata"
	"errors"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetResourcesLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewGetResourcesLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetResourcesLogic {
	return &GetResourcesLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *GetResourcesLogic) GetResources(in *pb.GetResourcesReq) (*pb.ResourcesResp, error) {
	userID := ctxdata.UserInfo(l.ctx).Id
	if userID == 0 {
		return nil, errors.New("invalid user id")
	}

	db := l.svcCtx.DB.WithContext(l.ctx).Order("create_time " + in.Order)

	if in.Id == nil {
		db = db.Where("r.parent_id IS NULL")
	} else {
		db = db.Where("r.parent_id = ?", *in.Id)
	}

	var files []*pb.ResourceInfo
	if err := db.Table("resources AS r").
		Select(`r.*,
			CASE 
				WHEN r.type = 0 THEN COUNT(f.id)
				ELSE NULL
			END AS count,
			CASE
				WHEN COUNT(l.user_id) > 0 THEN 1
				ELSE 0
			END AS favorite
		`).
		Where("r.remove = ?", enum.ResourceNormal).
		Joins("LEFT JOIN resources AS f ON f.parent_id = r.id AND f.remove = ?", enum.ResourceNormal).
		Joins("LEFT JOIN favorites AS l ON l.user_id = ? AND l.resource_id = r.id", userID).
		Group("r.id").
		Scan(&files).Error; err != nil {
		return nil, err
	}

	return &pb.ResourcesResp{List: files}, nil
}
