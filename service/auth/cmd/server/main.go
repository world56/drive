package main

import (
	httpServer "auth/cmd/http-server"
	"log"
)

func main() {
	if err := httpServer.Run("0.0.0.0:9002"); err != nil {
		log.Fatal(err)
	}
}
