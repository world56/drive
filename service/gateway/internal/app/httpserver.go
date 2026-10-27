package app

import (
	"fmt"
	"gateway/internal/middleware"
	"gateway/internal/proxy"
	"log/slog"
	"net/http"

	"github.com/go-chi/chi/v5"
	chimw "github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func (a *App) RunHTTP() error {
	a.log.Info("listening", "addr", a.Config.HTTP_ADDR)
	return a.http.ListenAndServe()
}

func (a *App) buildHandler() (http.Handler, error) {
	auth := middleware.NewAuth(a.Redis, a.Config.JWT_SECRET)
	tr := proxy.SharedTransport()

	r := chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(chimw.ClientIPFromRemoteAddr)
	r.Use(chimw.Recoverer)
	r.Use(middleware.AccessLog(!a.Config.IsLocal()))
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
	}))

	for _, route := range a.Config.Routes() {
		if route.Upstream == "" {
			return nil, fmt.Errorf("empty upstream for %s", route.Prefix)
		}

		h, err := proxy.New(route, tr)
		if err != nil {
			return nil, err
		}

		if route.Auth {
			h = auth.Handle(route.Whitelist)(h)
		}

		r.Handle(route.Prefix, h)
		r.Handle(route.Prefix+"/*", h)
		slog.Info("route", "prefix", route.Prefix, "upstream", route.Upstream)
	}

	return r, nil
}
