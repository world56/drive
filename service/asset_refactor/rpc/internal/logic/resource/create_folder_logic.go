package resourcelogic

import (
	"context"
	"errors"

	"asset/rpc/internal/enum"
	"asset/rpc/internal/model"
	"asset/rpc/internal/svc"
	"asset/rpc/pb"
	"common/ctxdata"

	"google.golang.org/protobuf/types/known/emptypb"
	"gorm.io/gorm"

	"github.com/zeromicro/go-zero/core/logx"

	logclient "auth/rpc/client/log"
	utils "common/utils/jsonstring"
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

	userId := ctxdata.UserInfo(l.ctx).Id

	folder = model.Resource{
		CreatorId: userId,
		Name:      in.Name,
		FullName:  in.Name,
		Remark:    in.Remark,
		ParentId:  in.ParentId,
		Type:      enum.ResourceTypeFolder,
	}
	if err := db.Create(&folder).Error; err != nil {
		return nil, err
	}

	l.svcCtx.LogRpc.CreateLog(l.ctx, &logclient.CreateLogReq{
		OperatorId: userId,
		Desc:       utils.ToDescString(folder),
		Event:      enum.LogEventResourceMkdirFolder,
	})

	return &emptypb.Empty{}, nil
}
