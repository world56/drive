package main

import (
	"auth/internal/app"
	"log"
)

func main() {
	a, err := app.New()
	if err != nil {
		log.Fatal(err)
	}
	defer a.Close()

	errCh := make(chan error, 3)

	go func() { errCh <- a.RunHTTP() }()
	go func() { errCh <- a.RunGRPC() }()
	go func() { errCh <- a.RunMQConsumer() }()

	log.Fatal(<-errCh)
}
