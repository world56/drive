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
	"common/idgen"

	"google.golang.org/protobuf/types/known/emptypb"

	"github.com/zeromicro/go-zero/core/logx"
)

type UpdateUserPasswordLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

type UserResetPassword struct {
	Id       string `json:"id"`
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
	operatorId := ctxdata.UserID(l.ctx)

	var userPwd UserResetPassword
	if err := json.Unmarshal([]byte(body.Data), &userPwd); err != nil {
		return nil, err
	}

	if operatorId == "" || userPwd.Id != operatorId {
		return nil, errors.New("Unauthorized")
	}

	userID, err := idgen.Parse(userPwd.Id)
	if err != nil {
		return nil, errors.New("Not a valid user")
	}

	db := l.svcCtx.DB.WithContext(l.ctx)
	var user model.User
	if err := db.
		Select("password", "account", "name", "role", "status").
		Where("id = ?", userID).
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
		Where("id = ?", userID).
		Update("password", hash).Error; err != nil {
		return nil, err
	}

	loglogic.NewCreateLogLogic(l.ctx, l.svcCtx).CreateLog(&pb.CreateLogReq{
		OperatorId: userID,
		Event:      enum.LogEventPwdUpdate,
		Desc: utils.ToDescString(map[string]interface{}{
			"name":    user.Name,
			"role":    user.Role,
			"id":      userPwd.Id,
			"status":  user.Status,
			"account": user.Account,
		}),
	})

	return &emptypb.Empty{}, nil
}
