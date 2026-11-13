package resourcelogic

import (
	"context"

	"asset/rpc/internal/svc"
	"asset/rpc/pb"
	"google.golang.org/protobuf/types/known/emptypb"

	"github.com/zeromicro/go-zero/core/logx"
)

type CreateResourceLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewCreateResourceLogic(ctx context.Context, svcCtx *svc.ServiceContext) *CreateResourceLogic {
	return &CreateResourceLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *CreateResourceLogic) CreateResource(in *pb.CreateResourceReq) (*emptypb.Empty, error) {
	// todo: add your logic here and delete this line

	return &emptypb.Empty{}, nil
}
