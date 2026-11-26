package main

import (
	"auth/mq/internal/config"
	"auth/mq/internal/listen"
	"auth/mq/internal/svc"
	"context"
	"flag"
	"log"

	"github.com/zeromicro/go-zero/core/conf"
)

var configFile = flag.String("f", "etc/auth.yaml", "the config file")

func main() {
	flag.Parse()

	var c config.Config
	conf.MustLoad(*configFile, &c)
	svcCtx := svc.NewServiceContext(c)

	if err := listen.Start(context.Background(), svcCtx); err != nil {
		log.Fatal(err)
	}
}
