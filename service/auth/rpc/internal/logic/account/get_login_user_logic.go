package accountlogic

import (
	"context"
	"errors"
	"strconv"
	"time"

	"auth/rpc/internal/svc"
	"auth/rpc/pb"
	statsclient "stats/rpc/client/stats"

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

	go func(id string) {
		ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
		defer cancel()
		_, _ = l.svcCtx.StatsRpc.UpdateAccess(ctx, &statsclient.UpdateAccessReq{UserId: id})
	}(in.Id)

	return &pb.GetLoginUserResp{
		Id:      user["id"],
		Role:    int32(role),
		Name:    user["name"],
		Account: user["account"],
	}, nil
}
