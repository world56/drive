package accountlogic

import (
	"context"
	"errors"
	"strconv"

	"auth/internal/svc"
	"auth/pb"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetLoginUserLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewGetLoginUserLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetLoginUserLogic {
	return &GetLoginUserLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *GetLoginUserLogic) GetLoginUser(in *pb.LoginUserReq) (*pb.GetLoginUserResp, error) {
	user, err := l.svcCtx.Redis.HGetAll(l.ctx, "drive:user:"+in.Id).Result()
	if err != nil {
		return nil, err
	}

	if len(user) == 0 {
		return nil, errors.New("Login timeout")
	}

	role, err := strconv.Atoi(user["role"])
	if err != nil {
		return nil, errors.New("Failed to acquire a character")
	}

	// s.grpcClient.Stats.Access(UserID)

	return &pb.GetLoginUserResp{
		Id:      user["id"],
		Role:    int32(role),
		Name:    user["name"],
		Account: user["account"],
	}, nil
}
