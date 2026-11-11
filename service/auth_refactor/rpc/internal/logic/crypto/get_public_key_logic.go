package cryptologic

import (
	"context"
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"encoding/pem"
	"errors"

	"auth/internal/svc"
	"auth/pb"

	"google.golang.org/protobuf/types/known/emptypb"

	"github.com/redis/go-redis/v9"
	"github.com/zeromicro/go-zero/core/logx"
)

type GetPublicKeyLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

type Key struct {
	Public  string
	Private string
}

func NewGetPublicKeyLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetPublicKeyLogic {
	return &GetPublicKeyLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *GetPublicKeyLogic) GetPublicKey(in *emptypb.Empty) (*pb.GetPublicKeyResp, error) {
	const KEY = "drive:rsa"

	public, err := l.svcCtx.Redis.HGet(l.ctx, KEY, "public").Result()
	if err != nil && !errors.Is(err, redis.Nil) {
		return nil, err
	}

	if public != "" {
		return &pb.GetPublicKeyResp{PublicKey: public}, nil
	}

	err = l.svcCtx.Redis.Watch(l.ctx, func(tx *redis.Tx) error {
		cachePublicKey, err := tx.HGet(l.ctx, KEY, "public").Result()
		if err == nil && cachePublicKey != "" {
			public = cachePublicKey
			return nil
		}
		if err != nil && !errors.Is(err, redis.Nil) {
			return err
		}

		key, err := l.regenerateKey()
		if err != nil {
			return err
		}
		_, err = tx.TxPipelined(l.ctx, func(pipe redis.Pipeliner) error {
			pipe.HSet(l.ctx, KEY, "public", key.Public, "private", key.Private)
			return nil
		})
		if err != nil {
			return err
		}

		public = key.Public
		return nil
	}, KEY)

	if errors.Is(err, redis.TxFailedErr) {
		public, err = l.svcCtx.Redis.HGet(l.ctx, KEY, "public").Result()
	}

	if err != nil {
		return nil, err
	}
	if public == "" {
		return nil, errors.New("generation failure")
	}

	return &pb.GetPublicKeyResp{PublicKey: public}, nil
}

func (l *GetPublicKeyLogic) regenerateKey() (*Key, error) {
	privateKey, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		return nil, err
	}

	privateKeyDER, err := x509.MarshalPKCS8PrivateKey(privateKey)
	if err != nil {
		return nil, err
	}

	privatePEM := pem.EncodeToMemory(&pem.Block{Type: "PRIVATE KEY", Bytes: privateKeyDER})
	publicKeyDER, err := x509.MarshalPKIXPublicKey(&privateKey.PublicKey)
	if err != nil {
		return nil, err
	}

	publicPEM := pem.EncodeToMemory(&pem.Block{Type: "PUBLIC KEY", Bytes: publicKeyDER})

	return &Key{Public: string(publicPEM), Private: string(privatePEM)}, nil
}
