// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package svc

import (
	"stats/api/internal/config"
	statsclient "stats/rpc/client/stats"
	interceptorclient "common/interceptor/client"

	"github.com/zeromicro/go-zero/zrpc"
)

type ServiceContext struct {
	Config   config.Config
	StatsRpc statsclient.Stats
}

func NewServiceContext(c config.Config) *ServiceContext {
	statsCli := zrpc.MustNewClient(c.StatsRpc, zrpc.WithUnaryClientInterceptor(interceptorclient.UnaryUser))
	return &ServiceContext{
		Config:   c,
		StatsRpc: statsclient.NewStats(statsCli),
	}
}
