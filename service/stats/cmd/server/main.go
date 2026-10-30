package main

import (
	"log"
	"stats/internal/app"
)

func main() {
	a, err := app.New()
	if err != nil {
		a.Close()
		log.Fatal(err)
	}
	defer a.Close()

	ch := make(chan error, 2)

	go func() { ch <- a.RunHTTP() }()
	go func() { ch <- a.RunGRPC() }()

	err = <-ch
	if err != nil {
		log.Println(err)
	}
}
