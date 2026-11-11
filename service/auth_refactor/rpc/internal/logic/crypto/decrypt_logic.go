package cryptologic

import (
	"context"
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha256"
	"crypto/x509"
	"encoding/base64"
	"encoding/pem"
	"errors"

	"auth/internal/svc"
	"auth/pb"

	"github.com/zeromicro/go-zero/core/logx"
)

type DecryptLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewDecryptLogic(ctx context.Context, svcCtx *svc.ServiceContext) *DecryptLogic {
	return &DecryptLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *DecryptLogic) Decrypt(in *pb.RSAKey) (*pb.RSAKey, error) {
	privateKey, err := l.svcCtx.Redis.HGet(l.ctx, "drive:rsa", "private").Result()
	if err != nil {
		return nil, err
	}

	cipherText, err := base64.StdEncoding.DecodeString(in.Data)
	if err != nil {
		return nil, errors.New("base64 decode error")
	}

	block, _ := pem.Decode([]byte(privateKey))
	if block == nil {
		return nil, errors.New("failed to parse PEM block")
	}

	priv, err := x509.ParsePKCS8PrivateKey(block.Bytes)
	if err != nil {
		return nil, err
	}

	rsaPriv, ok := priv.(*rsa.PrivateKey)
	if !ok {
		return nil, errors.New("not an rsa private key")
	}

	plain, err := rsa.DecryptOAEP(sha256.New(), rand.Reader, rsaPriv, cipherText, nil)
	if err != nil {
		return nil, err
	}

	return &pb.RSAKey{Data: string(plain)}, nil
}
