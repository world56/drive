package resourcelogic

import (
	"context"
	"errors"

	"asset/rpc/internal/enum"
	"asset/rpc/internal/model"
	"asset/rpc/internal/svc"
	"asset/rpc/pb"
	authpb "auth/rpc/pb"
	"common/ctxdata"
	rabbitmq "common/rabbitmq"
	utils "common/utils/jsonstring"

	"google.golang.org/protobuf/types/known/emptypb"
	"gorm.io/gorm"

	"time"

	"github.com/zeromicro/go-zero/core/logx"
)

type CreateFolderLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewCreateFolderLogic(ctx context.Context, svcCtx *svc.ServiceContext) *CreateFolderLogic {
	return &CreateFolderLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *CreateFolderLogic) CreateFolder(in *pb.CreateFolderReq) (*emptypb.Empty, error) {
	db := l.svcCtx.DB.WithContext(l.ctx)

	var folder model.Resource
	err := db.Where("name = ?", in.Name).Where("parent_id IS NOT DISTINCT FROM ?", in.ParentId).First(&folder).Error

	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	} else if err == nil {
		return nil, errors.New("folder already exists")
	}

	user := ctxdata.UserInfo(l.ctx)
	if user.Id == 0 {
		return nil, errors.New("invalid user id")
	}

	folder = model.Resource{
		CreatorId: user.Id,
		Name:      in.Name,
		FullName:  in.Name,
		Remark:    in.Remark,
		ParentId:  in.ParentId,
		Type:      enum.ResourceTypeFolder,
	}
	if err := db.Create(&folder).Error; err != nil {
		return nil, err
	}

	l.svcCtx.RabbitMQ.Publish(l.ctx, rabbitmq.PublishOptions{
		RoutingKey:  "create",
		Exchange:    "log",
		ContentType: "application/protobuf",
		Message: &authpb.CreateLogReq{
			OperatorId: user.Id,
			CreateTime: time.Now().UnixMilli(),
			Desc:       utils.ToDescString(folder),
			Event:      enum.LogEventResourceMkdirFolder,
		},
	})

	return &emptypb.Empty{}, nil
}
