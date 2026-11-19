package svc

import (
	"common/rdb"
	"stats/rpc/internal/config"

	"github.com/redis/go-redis/v9"
	"github.com/zeromicro/go-zero/core/logx"
	"github.com/zeromicro/go-zero/zrpc"

	favoriteclient "asset/rpc/client/favorite"
	resourceclient "asset/rpc/client/resource"
	interceptorclient "common/interceptor/client"
	storageclient "storage/rpc/client/storage"
)

type ServiceContext struct {
	Config config.Config
	Redis  *redis.Client

	StorageRpc  storageclient.Storage
	ResourceRpc resourceclient.Resource
	FavoriteRpc favoriteclient.Favorite
}

func NewServiceContext(c config.Config) *ServiceContext {
	redis, err := rdb.InitRedis(c.RedisUrl)
	logx.Must(err)

	resourceCli := zrpc.MustNewClient(c.AssetRpc, zrpc.WithUnaryClientInterceptor(interceptorclient.UnaryUser))
	storageCli := zrpc.MustNewClient(c.StorageRpc, zrpc.WithUnaryClientInterceptor(interceptorclient.UnaryUser))

	return &ServiceContext{
		Config:      c,
		Redis:       redis,
		StorageRpc:  storageclient.NewStorage(storageCli),
		FavoriteRpc: favoriteclient.NewFavorite(resourceCli),
		ResourceRpc: resourceclient.NewResource(resourceCli),
	}
}
