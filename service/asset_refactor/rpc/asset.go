package main

import (
	"asset/rpc/internal/config"
	favoriteServer "asset/rpc/internal/server/favorite"
	recycleServer "asset/rpc/internal/server/recycle"
	resourceServer "asset/rpc/internal/server/resource"
	"asset/rpc/internal/svc"
	"asset/rpc/pb"
	interceptorcommon "common/interceptor/server"
	"flag"
	"fmt"

	"github.com/zeromicro/go-zero/core/conf"
	"github.com/zeromicro/go-zero/core/service"
	"github.com/zeromicro/go-zero/zrpc"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

var configFile = flag.String("f", "etc/asset.yaml", "the config file")

func main() {
	flag.Parse()

	var c config.Config
	conf.MustLoad(*configFile, &c)
	ctx := svc.NewServiceContext(c)

	s := zrpc.MustNewServer(c.RpcServerConf, func(grpcServer *grpc.Server) {
		pb.RegisterResourceServer(grpcServer, resourceServer.NewResourceServer(ctx))
		pb.RegisterFavoriteServer(grpcServer, favoriteServer.NewFavoriteServer(ctx))
		pb.RegisterRecycleServer(grpcServer, recycleServer.NewRecycleServer(ctx))

		if c.Mode == service.DevMode || c.Mode == service.TestMode {
			reflection.Register(grpcServer)
		}
	})

	s.AddUnaryInterceptors(interceptorcommon.UnaryUser)
	defer s.Stop()

	fmt.Printf("Starting rpc server at %s...\n", c.ListenOn)
	s.Start()
}
