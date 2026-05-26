package main

import (
	"log"
	"stats/internal/app"
)

func main() {
	a, err := app.New()
	if err != nil {
		log.Fatal(err)
	}

	ch := make(chan error, 2)

	go func() {
		ch <- a.RunHTTP()
	}()

	log.Fatal(<-ch)
}
