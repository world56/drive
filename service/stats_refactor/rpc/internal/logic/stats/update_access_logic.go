package statslogic

import (
	"context"
	"time"

	"common/ctxdata"
	"stats/rpc/internal/svc"
	"stats/rpc/pb"

	"google.golang.org/protobuf/types/known/emptypb"

	"github.com/zeromicro/go-zero/core/logx"
)

type UpdateAccessLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewUpdateAccessLogic(ctx context.Context, svcCtx *svc.ServiceContext) *UpdateAccessLogic {
	return &UpdateAccessLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *UpdateAccessLogic) UpdateAccess(in *pb.UpdateAccessReq) (*emptypb.Empty, error) {
	userId := in.GetUserId()
	if userId == "" {
		userId = ctxdata.UserInfo(l.ctx).Id
	}
	if userId == "" {
		return &emptypb.Empty{}, nil
	}

	key := "drive:use:" + time.Now().Format("01-02")
	if _, err := l.svcCtx.Redis.SAdd(l.ctx, key, userId).Result(); err != nil {
		return nil, err
	}

	now := time.Now()
	end := time.Date(now.Year(), now.Month(), now.Day()+14, 0, 0, 0, 0, now.Location())
	if err := l.svcCtx.Redis.Expire(l.ctx, key, time.Until(end)).Err(); err != nil {
		return nil, err
	}

	return &emptypb.Empty{}, nil
}
