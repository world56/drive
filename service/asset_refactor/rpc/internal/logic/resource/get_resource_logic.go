package resourcelogic

import (
	"context"

	"asset/rpc/internal/enum"
	"asset/rpc/internal/svc"
	"asset/rpc/pb"

	"github.com/zeromicro/go-zero/core/logx"

	// userclient "auth/rpc/client/user"
	userclient "auth/rpc/client/user"
)

type GetResourceLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewGetResourceLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetResourceLogic {
	return &GetResourceLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *GetResourceLogic) GetResource(in *pb.GetResourceReq) (*pb.ResourceInfo, error) {
	var resource pb.ResourceInfo

	if err := l.svcCtx.DB.WithContext(l.ctx).
		Table("resources AS r").
		Select(`
        r.*,
        to_char(r.create_time, 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"') AS create_time,
        CASE
            WHEN r.type = 0 THEN COUNT(f.id)
            ELSE NULL
        END AS count
    `).
		Joins("LEFT JOIN resources AS f ON f.parent_id = r.id AND f.remove = ?", enum.ResourceNormal).
		Where("r.id = ? AND r.remove = ?", in.Id, enum.ResourceNormal).
		Group("r.id").
		Scan(&resource).Error; err != nil {
		return nil, err
	}

	user, err := l.svcCtx.UserRpc.GetUser(l.ctx, &userclient.GetUserReq{
		Id: resource.CreatorId,
	})
	if err != nil || user == nil {
		unknown := "UNKNOWN"
		resource.CreatorName = &unknown
	} else {
		name := user.Name
		resource.CreatorName = &name
	}

	return &resource, nil
}
