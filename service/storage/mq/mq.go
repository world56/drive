package main

import (
	"context"
	"flag"
	"log"
	"storage/mq/internal/config"
	"storage/mq/internal/listen"
	"storage/mq/internal/svc"

	"github.com/zeromicro/go-zero/core/conf"
)

var configFile = flag.String("f", "etc/storage.yaml", "the config file")

func main() {
	flag.Parse()

	var c config.Config
	conf.MustLoad(*configFile, &c)
	svcCtx := svc.NewServiceContext(c)

	if err := listen.Start(context.Background(), svcCtx); err != nil {
		log.Fatal(err)
	}
}
