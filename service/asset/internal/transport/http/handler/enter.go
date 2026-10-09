package handler

import "asset/internal/service"

type Handler struct {
	ResourceHandler *ResourceHandler
}

func NewHandler(svc *service.Service) *Handler {
	return &Handler{
		ResourceHandler: NewResourceHandler(svc.ResourceService),
	}
}
