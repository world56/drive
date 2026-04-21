package httpServer

import (
	"auth/internal/pkg/databases"
	"auth/internal/service"
	"auth/internal/transport/http/handler"
	"auth/internal/transport/http/router"

	"github.com/gin-gonic/gin"
)

func Run(addr string) error {
	app := gin.Default()

	db, sqlDBerr := databases.InitPostgresSQL()
	if sqlDBerr != nil {
		return sqlDBerr
	}

	redis, rDBerr := databases.InitReds()
	if rDBerr != nil {
		return rDBerr
	}

	svc := service.NewServer(db, redis)
	h := handler.NewHandler(svc)

	router.RegisterRoutes(app, h)

	if err := app.Run(addr); err != nil {
		return err
	}

	return nil
}
