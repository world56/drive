package main

import (
	"asset/mq/internal/config"
	"asset/mq/internal/listen"
	"asset/mq/internal/svc"
	"context"
	"flag"
	"log"

	"github.com/zeromicro/go-zero/core/conf"
	"golang.org/x/sync/errgroup"
)

var configFile = flag.String("f", "etc/asset.yaml", "the config file")

func main() {
	flag.Parse()

	var c config.Config
	conf.MustLoad(*configFile, &c)
	svcCtx := svc.NewServiceContext(c)

	runners := listen.Mqs(c, context.Background(), svcCtx)
	if len(runners) == 0 {
		log.Fatal("no mq consumers")
	}

	g, ctx := errgroup.WithContext(context.Background())
	_ = ctx

	for _, r := range runners {
		r := r
		g.Go(func() error {
			log.Printf("mq consumer starting: %s", r.Name)
			return r.Run()
		})
	}

	if err := g.Wait(); err != nil {
		log.Fatal(err)
	}
}
