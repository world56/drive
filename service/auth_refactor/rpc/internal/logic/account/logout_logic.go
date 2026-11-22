package accountlogic

import (
	utils "common/utils/jsonstring"
	"context"

	"auth/rpc/internal/enum"
	loglogic "auth/rpc/internal/logic/log"
	"auth/rpc/internal/svc"
	"auth/rpc/pb"

	"google.golang.org/protobuf/types/known/emptypb"

	"github.com/zeromicro/go-zero/core/logx"
)

type LogoutLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewLogoutLogic(ctx context.Context, svcCtx *svc.ServiceContext) *LogoutLogic {
	return &LogoutLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *LogoutLogic) Logout(in *pb.LoginUserReq) (*emptypb.Empty, error) {
	user, err := NewGetLoginUserLogic(l.ctx, l.svcCtx).GetLoginUser(&pb.LoginUserReq{Id: in.Id})
	if err != nil {
		return nil, err
	}

	if err := l.svcCtx.Redis.Del(l.ctx, "drive:user:"+in.Id).Err(); err != nil {
		return nil, err
	}

	loglogic.NewCreateLogLogic(l.ctx, l.svcCtx).CreateLog(&pb.CreateLogReq{
		Event:      enum.LogEventLogOut,
		OperatorId: in.Id,
		Desc:       utils.ToDescString(user),
	})

	return &emptypb.Empty{}, nil
}
