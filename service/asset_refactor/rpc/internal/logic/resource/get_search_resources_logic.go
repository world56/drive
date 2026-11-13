package resourcelogic

import (
	"context"
	"time"

	"asset/rpc/internal/enum"
	"asset/rpc/internal/model"
	"asset/rpc/internal/svc"
	"asset/rpc/pb"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetSearchResourcesLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewGetSearchResourcesLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetSearchResourcesLogic {
	return &GetSearchResourcesLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *GetSearchResourcesLogic) GetSearchResources(in *pb.GetSearchResourcesReq) (*pb.ResourcesResp, error) {
	db := l.svcCtx.DB.WithContext(l.ctx).
		Model(&model.Resource{}).
		Select("id", "type", "suffix", "parent_id", "full_name", `to_char(create_time, 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"') AS create_time`, "object_name").
		Where("remove = ?", 0).
		Where("name LIKE ?", "%"+in.Name+"%")

	if len(in.Type) > 0 {
		db = db.Where("type IN ?", in.Type)
	}
	if in.StartTime != nil && in.EndTime != nil {
		endTime := time.Unix(*in.EndTime, 0)
		startTime := time.Unix(*in.StartTime, 0)
		db = db.Where("create_time >= ? AND create_time <= ?", startTime, endTime)
	}
	order := enum.SortDesc
	if in.Sort == enum.SortAsc {
		order = enum.SortAsc
	}
	db = db.Order("create_time " + order)

	var files []*pb.ResourceInfo
	if err := db.Find(&files).Error; err != nil {
		return nil, err
	}

	return &pb.ResourcesResp{List: files}, nil
}
