package userlogic

import (
	utils "common/utils/jsonstring"
	"context"
	"encoding/json"
	"errors"

	"auth/rpc/internal/enum"
	cryptologic "auth/rpc/internal/logic/crypto"
	loglogic "auth/rpc/internal/logic/log"
	"auth/rpc/internal/model"
	"auth/rpc/internal/pkg/pwd"
	"auth/rpc/internal/svc"
	"auth/rpc/pb"
	"common/ctxdata"

	"google.golang.org/protobuf/types/known/emptypb"

	"github.com/zeromicro/go-zero/core/logx"
)

type AdminResetUserPasswordLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

type AdminResetUserPassword struct {
	Id       string `json:"id"`
	Password string `json:"password"` // 新密码
}

func NewAdminResetUserPasswordLogic(ctx context.Context, svcCtx *svc.ServiceContext) *AdminResetUserPasswordLogic {
	return &AdminResetUserPasswordLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *AdminResetUserPasswordLogic) AdminResetUserPassword(in *pb.AdminResetUserPasswordReq) (*emptypb.Empty, error) {
	body, err := cryptologic.NewDecryptLogic(l.ctx, l.svcCtx).Decrypt(&pb.RSAKey{Data: in.Password})
	if err != nil {
		return nil, err
	}

	var userPwd AdminResetUserPassword
	if err := json.Unmarshal([]byte(body.Data), &userPwd); err != nil {
		return nil, err
	}

	db := l.svcCtx.DB.WithContext(l.ctx)
	var user model.User
	if err := db.
		Select("password", "account", "name", "role", "status").
		Where("id = ?", userPwd.Id).
		First(&user).Error; err != nil {
		return nil, errors.New("Not a valid user")
	}

	pwd, err := pwd.HashPassword(userPwd.Password)
	if err != nil {
		return nil, err
	}

	if err := db.Model(&user).
		Where("id = ?", userPwd.Id).
		Update("password", pwd).
		Error; err != nil {
		return nil, err
	}

	loglogic.NewCreateLogLogic(l.ctx, l.svcCtx).CreateLog(&pb.CreateLogReq{
		Event:      enum.LogEventPwdUpdate,
		OperatorId: ctxdata.UserInfo(l.ctx).Id,
		Desc: utils.ToDescString(map[string]interface{}{
			"name":    user.Name,
			"role":    user.Role,
			"id":      userPwd.Id,
			"account": user.Account,
			"status":  user.Status,
		}),
	})

	return &emptypb.Empty{}, nil
}
