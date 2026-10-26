package handler

import "asset/internal/service"

type Handler struct {
	ResourceHandler *ResourceHandler
	FavoriteHandler *FavoriteHandler
}

func NewHandler(svc *service.Service) *Handler {
	return &Handler{
		ResourceHandler: NewResourceHandler(svc.ResourceService),
		FavoriteHandler: NewFavoriteHandler(svc.FavoriteService),
	}
}
