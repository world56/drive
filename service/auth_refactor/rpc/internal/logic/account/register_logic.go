package accountlogic

import (
	"context"
	"encoding/json"
	"errors"

	"auth/internal/enum"
	cryptologic "auth/internal/logic/crypto"
	"auth/internal/model"
	"auth/internal/pkg/pwd"
	"auth/internal/svc"
	"auth/pb"

	"google.golang.org/protobuf/types/known/emptypb"

	"github.com/zeromicro/go-zero/core/logx"
)

type RegisterLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewRegisterLogic(ctx context.Context, svcCtx *svc.ServiceContext) *RegisterLogic {
	return &RegisterLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *RegisterLogic) Register(in *pb.UserAuthReq) (*emptypb.Empty, error) {
	has, err := NewExistAdminLogic(l.ctx, l.svcCtx).ExistAdmin(&emptypb.Empty{})
	if err != nil || has.Exists {
		return nil, errors.New("Illegal request")
	}

	body, err := cryptologic.NewDecryptLogic(l.ctx, l.svcCtx).Decrypt(&pb.RSAKey{Data: in.Data})
	if err != nil {
		return nil, err
	}

	var user model.User
	if err := json.Unmarshal([]byte(body.Data), &user); err != nil {
		return nil, err
	}

	user.Name = "Administrator"
	user.Role = enum.UserRoleAdmin
	hash, err := pwd.HashPassword(user.Password)
	if err != nil {
		return nil, err
	}

	user.Password = hash
	if err = l.svcCtx.DB.WithContext(l.ctx).Create(&user).Error; err != nil {
		return nil, err
	}

	return &emptypb.Empty{}, nil
}
