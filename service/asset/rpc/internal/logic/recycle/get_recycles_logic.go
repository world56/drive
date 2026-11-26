package recyclelogic

import (
	"context"

	"asset/rpc/internal/svc"
	"asset/rpc/pb"

	"google.golang.org/protobuf/types/known/emptypb"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetRecyclesLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewGetRecyclesLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetRecyclesLogic {
	return &GetRecyclesLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *GetRecyclesLogic) GetRecycles(in *emptypb.Empty) (*pb.GetRecyclesResp, error) {
	var recycles []*pb.RecycleInfo

	if err := l.svcCtx.DB.
		WithContext(l.ctx).
		Table("recycles AS re").
		Select(`
				re.id,
				re.user_id,
				re.resource_id,
				u.name AS user_name,
				r.full_name,
				r.type,
				r.size,
				r.suffix,
				r.object_name,
				r.remove,
				r.parent_id,
				to_char(r.create_time, 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"') AS create_time,
				r.download_count,
				(
					SELECT COUNT(*)
					FROM resources AS res
					WHERE res.parent_id = r.id
				) AS count
		`).
		Joins("INNER JOIN resources AS r ON re.resource_id = r.id").
		Joins("LEFT JOIN users AS u ON re.user_id = u.id").
		Order("re.create_time DESC").
		Scan(&recycles).Error; err != nil {
		return nil, err
	}

	return &pb.GetRecyclesResp{List: recycles}, nil
}
