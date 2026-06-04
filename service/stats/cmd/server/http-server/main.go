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

	if err := a.RunHTTP(); err != nil {
		log.Fatal(err)
	}
}
