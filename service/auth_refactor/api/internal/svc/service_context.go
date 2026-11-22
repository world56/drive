// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package svc

import (
	"auth/api/internal/config"
	"auth/api/internal/middleware"

	"github.com/zeromicro/go-zero/rest"
	"github.com/zeromicro/go-zero/zrpc"

	interceptorclient "common/interceptor/client"

	accountclient "auth/rpc/client/account"
	cryptoclient "auth/rpc/client/crypto"
	logclient "auth/rpc/client/log"
	userclient "auth/rpc/client/user"
)

type ServiceContext struct {
	Config     config.Config
	RoleGuard  rest.Middleware
	LogRpc     logclient.Log
	UserRpc    userclient.User
	CryptoRpc  cryptoclient.Crypto
	AccountRpc accountclient.Account
}

func NewServiceContext(c config.Config) *ServiceContext {
	authRpc := zrpc.MustNewClient(c.AuthRpc, zrpc.WithUnaryClientInterceptor(interceptorclient.UnaryUser))
	return &ServiceContext{
		Config:     c,
		RoleGuard:  middleware.NewRoleGuardMiddleware().Handle,
		LogRpc:     logclient.NewLog(authRpc),
		UserRpc:    userclient.NewUser(authRpc),
		CryptoRpc:  cryptoclient.NewCrypto(authRpc),
		AccountRpc: accountclient.NewAccount(authRpc),
	}
}
