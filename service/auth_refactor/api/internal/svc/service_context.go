// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package svc

import (
	"auth/api/internal/config"

	"github.com/zeromicro/go-zero/zrpc"

	interceptorclient "common/interceptor/client"

	accountclient "auth/rpc/client/account"
	cryptoclient "auth/rpc/client/crypto"

	logclient "auth/rpc/client/log"
)

type ServiceContext struct {
	Config     config.Config
	LogRpc     logclient.Log
	CryptoRpc  cryptoclient.Crypto
	AccountRpc accountclient.Account
}

func NewServiceContext(c config.Config) *ServiceContext {
	authRpc := zrpc.MustNewClient(c.AuthRpc, zrpc.WithUnaryClientInterceptor(interceptorclient.UnaryUser))
	return &ServiceContext{
		Config:     c,
		LogRpc:     logclient.NewLog(authRpc),
		CryptoRpc:  cryptoclient.NewCrypto(authRpc),
		AccountRpc: accountclient.NewAccount(authRpc),
	}
}
