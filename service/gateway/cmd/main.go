package main

import (
	"flag"
	"log"

	"gateway/internal/app"
	"gateway/internal/config"

	"github.com/zeromicro/go-zero/core/conf"
)

var configFile = flag.String("f", "etc/gateway.yaml", "the config file")

func main() {
	flag.Parse()

	var c config.Config
	conf.MustLoad(*configFile, &c)

	a, err := app.New(c)
	if err != nil {
		if a != nil {
			a.Close()
		}
		log.Fatal(err)
	}
	defer a.Close()

	if err := a.RunHTTP(); err != nil {
		log.Println(err)
	}
}
