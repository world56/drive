package userlogic

import (
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

type CreateUserLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewCreateUserLogic(ctx context.Context, svcCtx *svc.ServiceContext) *CreateUserLogic {
	return &CreateUserLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *CreateUserLogic) CreateUser(in *pb.CreateUserReq) (*emptypb.Empty, error) {
	var count int64
	if err := l.svcCtx.DB.WithContext(l.ctx).
		Model(&model.User{}).
		Where("account = ?", in.Account).
		Count(&count).
		Error; err != nil {
		return nil, err
	}

	if count > 0 {
		return nil, errors.New("Account already exists")
	}

	text, err := cryptologic.NewDecryptLogic(l.ctx, l.svcCtx).Decrypt(&pb.RSAKey{Data: in.Password})
	if err != nil {
		return nil, errors.New("Parse failed")
	}

	var password string
	if err := json.Unmarshal([]byte(text.Data), &password); err != nil {
		return nil, err
	}

	passwordHash, err := pwd.HashPassword(password)
	if err != nil {
		return nil, err
	}

	if err := l.svcCtx.DB.Create(&model.User{
		Name:     in.Name,
		Account:  in.Account,
		Remark:   *in.Remark,
		Contact:  *in.Contact,
		Password: passwordHash,
		Role:     enum.UserRoleRegular,
		Status:   enum.UserStatusActive,
	}).Error; err != nil {
		return nil, err
	}

	loglogic.NewCreateLogLogic(l.ctx, l.svcCtx).CreateLog(&pb.CreateLogReq{
		Desc:       in.Account,
		Event:      enum.LogEventUserInsert,
		OperatorId: ctxdata.OperatorId(l.ctx),
	})

	return &emptypb.Empty{}, nil
}
