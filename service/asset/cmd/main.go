package main

import (
	"asset/internal/app"
	"log"
)

func main() {
	a, err := app.New()
	if err != nil {
		log.Fatal(err)
	}

	errCh := make(chan error, 2)

	go func() {
		errCh <- a.RunHTTP()
	}()

	go func() {
		errCh <- a.RunGRPC()
	}()

	log.Fatal(<-errCh)
}
