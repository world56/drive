package userlogic

import (
	"context"

	"auth/rpc/internal/enum"
	"auth/rpc/internal/model"
	"auth/rpc/internal/svc"
	"auth/rpc/pb"

	"gorm.io/gorm"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetUsersLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewGetUsersLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetUsersLogic {
	return &GetUsersLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *GetUsersLogic) GetUsers(in *pb.GetUsersReq) (*pb.GetUsersResp, error) {
	db := l.svcCtx.DB.WithContext(l.ctx).Model(&model.User{}).Where("role = ?", enum.UserRoleRegular)

	if in.Status != nil {
		db = db.Where("status = ?", *in.Status)
	}
	if in.Account != nil {
		db = db.Where("account = ?", *in.Account)
	}
	if in.Name != nil {
		db = db.Where("name LIKE ?", "%"+*in.Name+"%")
	}

	var count int64
	if err := db.Session(&gorm.Session{}).Count(&count).Error; err != nil {
		return nil, err
	}

	var users []*pb.UserInfo
	pageSize := int(in.PageSize)

	if err := db.
		Select("id", "name", "account", "status", "role", "remark", "contact", "create_time AS createTime").
		Offset((int(in.CurrentPage) - 1) * pageSize).
		Limit(pageSize).
		Find(&users).Error; err != nil {
		return nil, err
	}

	return &pb.GetUsersResp{Count: count, List: users}, nil
}
