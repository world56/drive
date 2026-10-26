package main

import (
	"log"
	"storage/internal/app"
)

func main() {
	a, err := app.New()

	if err != nil {
		a.Close()
		log.Fatal(err)
	}
	defer a.Close()

	ch := make(chan error, 1)

	go func() {
		ch <- a.RunHTTP()
	}()

	err = <-ch
	if err != nil {
		log.Println(err)
	}
}
