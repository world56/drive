package resourcelogic

import (
	"context"

	"asset/rpc/internal/enum"
	"asset/rpc/internal/model"
	"asset/rpc/internal/svc"
	"asset/rpc/pb"

	"google.golang.org/protobuf/types/known/emptypb"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetFoldersLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewGetFoldersLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetFoldersLogic {
	return &GetFoldersLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *GetFoldersLogic) GetFolders(in *emptypb.Empty) (*pb.ResourcesResp, error) {
	var folders []*pb.ResourceInfo
	if err := l.svcCtx.DB.WithContext(l.ctx).
		Model(&model.Resource{}).
		Select("id", "name", "parent_id", "type").
		Where("remove = ?", enum.ResourceNormal).
		Where("type = ?", enum.ResourceTypeFolder).
		Find(&folders).Error; err != nil {
		return nil, err
	}

	return &pb.ResourcesResp{List: folders}, nil
}
