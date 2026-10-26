package main

import (
	"asset/internal/app"
	"log"
)

func main() {
	a, err := app.New()

	if err != nil {
		a.Close()
		log.Fatal(err)
	}
	defer a.Close()

	ch := make(chan error, 3)

	go func() { ch <- a.RunHTTP() }()
	go func() { ch <- a.RunGRPC() }()
	go func() { ch <- a.RunMQConsumer() }()

	err = <-ch
	if err != nil {
		log.Println(err)
	}
}
