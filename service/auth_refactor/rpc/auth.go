package main

import (
	"flag"
	"fmt"

	"auth/rpc/internal/config"
	accountServer "auth/rpc/internal/server/account"
	cryptoServer "auth/rpc/internal/server/crypto"
	logServer "auth/rpc/internal/server/log"
	userServer "auth/rpc/internal/server/user"
	interceptorcommon "common/interceptor/server"

	"auth/rpc/internal/svc"
	"auth/rpc/pb"

	"github.com/zeromicro/go-zero/core/conf"
	"github.com/zeromicro/go-zero/core/service"
	"github.com/zeromicro/go-zero/zrpc"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

var configFile = flag.String("f", "etc/auth.yaml", "the config file")

func main() {
	flag.Parse()

	var c config.Config
	conf.MustLoad(*configFile, &c)
	ctx := svc.NewServiceContext(c)

	s := zrpc.MustNewServer(c.RpcServerConf, func(grpcServer *grpc.Server) {
		pb.RegisterLogServer(grpcServer, logServer.NewLogServer(ctx))
		pb.RegisterUserServer(grpcServer, userServer.NewUserServer(ctx))
		pb.RegisterCryptoServer(grpcServer, cryptoServer.NewCryptoServer(ctx))
		pb.RegisterAccountServer(grpcServer, accountServer.NewAccountServer(ctx))
		if c.Mode == service.DevMode || c.Mode == service.TestMode {
			reflection.Register(grpcServer)
		}
	})

	s.AddUnaryInterceptors(interceptorcommon.UnaryUser)
	defer s.Stop()

	fmt.Printf("Starting rpc server at %s...\n", c.ListenOn)
	s.Start()
}
