package handler

import "stats/internal/service"

type Handler struct {
	StatsHandler *StatsHandler
}

func NewHandler(svc *service.Service) *Handler {
	return &Handler{
		StatsHandler: NewStatsHandler(svc.StatsService),
	}
}
