package accountlogic

import (
	"context"

	"auth/internal/enum"
	"auth/internal/model"
	"auth/internal/svc"
	"auth/pb"

	"google.golang.org/protobuf/types/known/emptypb"

	"github.com/zeromicro/go-zero/core/logx"
)

type ExistAdminLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewExistAdminLogic(ctx context.Context, svcCtx *svc.ServiceContext) *ExistAdminLogic {
	return &ExistAdminLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *ExistAdminLogic) ExistAdmin(in *emptypb.Empty) (*pb.ExistsAdminResp, error) {
	var count int64
	if err := l.svcCtx.DB.WithContext(l.ctx).
		Model(&model.User{}).
		Where("role = ?", enum.UserRoleAdmin).
		Limit(1).
		Count(&count).Error; err != nil {
		return nil, err
	}
	return &pb.ExistsAdminResp{Exists: count > 0}, nil
}
