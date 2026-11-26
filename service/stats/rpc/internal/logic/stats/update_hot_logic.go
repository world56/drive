package statslogic

import (
	"context"
	"errors"
	"strings"

	"stats/rpc/internal/svc"
	"stats/rpc/pb"

	"google.golang.org/protobuf/types/known/emptypb"

	"github.com/zeromicro/go-zero/core/logx"
)

type UpdateHotLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewUpdateHotLogic(ctx context.Context, svcCtx *svc.ServiceContext) *UpdateHotLogic {
	return &UpdateHotLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *UpdateHotLogic) UpdateHot(in *pb.UpdateHotReq) (*emptypb.Empty, error) {
	name := strings.TrimSpace(in.GetName())
	if name == "" {
		return nil, errors.New("name is required")
	}
	if err := l.svcCtx.Redis.ZIncrBy(l.ctx, "drive:hot", 1, name).Err(); err != nil {
		return nil, err
	}
	return &emptypb.Empty{}, nil
}
