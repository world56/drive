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

	if err := a.RunGRPC(); err != nil {
		log.Fatal(err)
	}
}
