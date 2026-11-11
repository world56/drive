package accountlogic

import (
	utils "common/utils/jsonstring"
	"context"
	"encoding/json"
	"errors"
	"time"

	"auth/rpc/internal/enum"
	cryptologic "auth/rpc/internal/logic/crypto"

	loglogic "auth/rpc/internal/logic/log"

	"auth/rpc/internal/model"
	jsonwebtoken "auth/rpc/internal/pkg/jwt"
	"auth/rpc/internal/pkg/pwd"
	"auth/rpc/internal/svc"
	"auth/rpc/pb"

	"github.com/zeromicro/go-zero/core/logx"
)

type LoginLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewLoginLogic(ctx context.Context, svcCtx *svc.ServiceContext) *LoginLogic {
	return &LoginLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *LoginLogic) Login(in *pb.UserAuthReq) (*pb.UserAuthTokenResp, error) {
	body, err := cryptologic.NewDecryptLogic(l.ctx, l.svcCtx).Decrypt(&pb.RSAKey{Data: in.Data})
	if err != nil {
		return nil, err
	}

	var login model.User
	if err := json.Unmarshal([]byte(body.Data), &login); err != nil {
		return nil, err
	}

	var user model.User
	if err := l.svcCtx.DB.WithContext(l.ctx).
		Select("id", "name", "account", "role", "status", "password").
		Where("account = ?", login.Account).
		First(&user).Error; err != nil {
		return nil, errors.New("Account Password Error")
	}

	if user.Status == enum.UserStatusFreeze {
		return nil, errors.New("Account Frozen, Please Contact The Administrator")
	}

	valid, err := pwd.VerifyPassword(login.Password, user.Password)
	if err != nil {
		return nil, err
	}
	if !valid {
		return nil, errors.New("Account Password Error")
	}

	UserId := user.Id.String()
	key := "drive:user:" + UserId
	userInfo := map[string]interface{}{
		"id":      UserId,
		"name":    user.Name,
		"role":    user.Role,
		"status":  user.Status,
		"account": user.Account,
	}

	if err := l.svcCtx.Redis.HSet(l.ctx, key, userInfo).Err(); err != nil {
		return nil, err
	}

	if err := l.svcCtx.Redis.Expire(l.ctx, key, 7*24*time.Hour).Err(); err != nil {
		return nil, err
	}

	loglogic.NewCreateLogLogic(l.ctx, l.svcCtx).CreateLog(&pb.CreateLogReq{
		OperatorId: UserId,
		Event:      enum.LogEventLogin,
		Desc:       utils.ToDescString(userInfo),
	})

	token, err := jsonwebtoken.CreateJWT(l.svcCtx.Config.JwtSecret, UserId)
	if err != nil {
		return nil, err
	}

	return &pb.UserAuthTokenResp{Token: token}, nil
}
