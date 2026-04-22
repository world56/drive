package main

import (
	"auth/internal/app"
	"log"
)

func main() {
	if err := app.RunHTTP(); err != nil {
		log.Fatal(err)
	}
}
