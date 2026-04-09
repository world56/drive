package main

import (
	"auth/internal/handler"
	"auth/internal/pkg/databases"
	"auth/internal/router"
	"auth/internal/service"

	"github.com/gin-gonic/gin"
)

func main() {
	app := gin.Default()

	db, sqlDBerr := databases.InitPostgresSQL()
	if sqlDBerr != nil {
		panic("sql" + sqlDBerr.Error())
	}

	redis, rDBerr := databases.InitReds()
	if rDBerr != nil {
		panic("rDBerr" + rDBerr.Error())
	}

	svc := service.NewServer(db, redis)
	h := handler.NewHandler(svc)

	router.RegisterRoutes(app, h)

	app.Run("0.0.0.0:9002")
}
