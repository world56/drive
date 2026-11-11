package userlogic

import (
	utils "common/utils/jsonstring"
	"context"
	"encoding/json"
	"errors"

	"auth/internal/enum"
	cryptologic "auth/internal/logic/crypto"
	loglogic "auth/internal/logic/log"
	"auth/internal/model"
	"auth/internal/pkg/ctxdata"
	"auth/internal/pkg/pwd"
	"auth/internal/svc"
	"auth/pb"

	"google.golang.org/protobuf/types/known/emptypb"

	"github.com/zeromicro/go-zero/core/logx"
)

type UpdateUserPasswordLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

type UserResetPassword struct {
	ID       string `json:"id"`
	Pwd      string `json:"pwd"`
	Password string `json:"password"`
}

func NewUpdateUserPasswordLogic(ctx context.Context, svcCtx *svc.ServiceContext) *UpdateUserPasswordLogic {
	return &UpdateUserPasswordLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *UpdateUserPasswordLogic) UpdateUserPassword(in *pb.UpdateUserPasswordReq) (*emptypb.Empty, error) {
	body, err := cryptologic.NewDecryptLogic(l.ctx, l.svcCtx).Decrypt(&pb.RSAKey{Data: in.Data})
	if err != nil {
		return nil, errors.New("Parse failed")
	}
	operatorId := ctxdata.OperatorId(l.ctx)

	var userPwd UserResetPassword
	if err := json.Unmarshal([]byte(body.Data), &userPwd); err != nil {
		return nil, err
	}

	if operatorId == "" || userPwd.ID != operatorId {
		return nil, errors.New("Unauthorized")
	}

	db := l.svcCtx.DB.WithContext(l.ctx)
	var user model.User
	if err := db.
		Select("password", "account", "name", "role", "status").
		Where("id = ?", userPwd.ID).
		First(&user).Error; err != nil {
		return nil, errors.New("Not a valid user")
	}

	valid, err := pwd.VerifyPassword(userPwd.Pwd, user.Password)
	if err != nil {
		return nil, err
	}
	if !valid {
		return nil, errors.New("Old password is incorrect")
	}

	hash, err := pwd.HashPassword(userPwd.Password)
	if err != nil {
		return nil, err
	}
	if err := db.Model(&user).
		Where("id = ?", userPwd.ID).
		Update("password", hash).Error; err != nil {
		return nil, err
	}

	loglogic.NewCreateLogLogic(l.ctx, l.svcCtx).CreateLog(&pb.CreateLogReq{
		Event:      enum.LogEventPwdUpdate,
		OperatorId: ctxdata.OperatorId(l.ctx),
		Desc: utils.ToDescString(map[string]interface{}{
			"name":    user.Name,
			"role":    user.Role,
			"id":      userPwd.ID,
			"status":  user.Status,
			"account": user.Account,
		}),
	})

	return &emptypb.Empty{}, nil
}
