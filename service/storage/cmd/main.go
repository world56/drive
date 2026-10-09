package main

import (
	"log"
	"storage/internal/app"
)

func main() {
	a, err := app.New()
	if err != nil {
		log.Fatalln(err)
	}

	ch := make(chan error, 1)

	go func() {
		ch <- a.RunHTTP()
	}()

	log.Fatal(<-ch)
}
