// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.2

package svc

import (
	"asset/api/internal/config"
	favoriteclient "asset/rpc/client/favorite"
	recycleclient "asset/rpc/client/recycle"
	resourceclient "asset/rpc/client/resource"
	interceptorclient "common/interceptor/client"

	"github.com/zeromicro/go-zero/zrpc"
)

type ServiceContext struct {
	Config      config.Config
	RecycleRpc  recycleclient.Recycle
	ResourceRpc resourceclient.Resource
	FavoriteRpc favoriteclient.Favorite
}

func NewServiceContext(c config.Config) *ServiceContext {
	assetRpc := zrpc.MustNewClient(c.AssetRpc, zrpc.WithUnaryClientInterceptor(interceptorclient.UnaryUser))
	return &ServiceContext{
		Config:      c,
		RecycleRpc:  recycleclient.NewRecycle(assetRpc),
		ResourceRpc: resourceclient.NewResource(assetRpc),
		FavoriteRpc: favoriteclient.NewFavorite(assetRpc),
	}
}
