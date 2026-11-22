package resourcelogic

import (
	"context"
	"strconv"

	"asset/rpc/internal/enum"
	"asset/rpc/internal/model"
	"asset/rpc/internal/svc"
	"asset/rpc/pb"

	"google.golang.org/protobuf/types/known/emptypb"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetCountLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewGetCountLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetCountLogic {
	return &GetCountLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *GetCountLogic) GetCount(_ *emptypb.Empty) (*pb.Count, error) {
	var data []struct {
		Type  int8  `gorm:"column:type"`
		Count int64 `gorm:"column:count"`
	}
	if err := l.svcCtx.DB.WithContext(l.ctx).
		Model(&model.Resource{}).
		Select("type, COUNT(*) AS count").
		Where("remove = ?", enum.ResourceNormal).
		Group("type").Find(&data).Error; err != nil {
		return nil, err
	}

	count := make(map[string]int64, len(data))
	for _, item := range data {
		count[strconv.Itoa(int(item.Type))] = item.Count
	}
	return &pb.Count{Count: count}, nil
}
