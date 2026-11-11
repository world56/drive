package userlogic

import (
	"context"

	"auth/internal/svc"
	"auth/pb"
	"google.golang.org/protobuf/types/known/emptypb"

	"github.com/zeromicro/go-zero/core/logx"
)

type AdminResetUserPasswordLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewAdminResetUserPasswordLogic(ctx context.Context, svcCtx *svc.ServiceContext) *AdminResetUserPasswordLogic {
	return &AdminResetUserPasswordLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *AdminResetUserPasswordLogic) AdminResetUserPassword(in *pb.AdminResetUserPasswordReq) (*emptypb.Empty, error) {
	// todo: add your logic here and delete this line

	return &emptypb.Empty{}, nil
}
