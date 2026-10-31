package handler

import "asset/internal/service"

type Handler struct {
	ResourceHandler *ResourceHandler
	FavoriteHandler *FavoriteHandler
	RecycleHandler  *RecycleHandler
}

func NewHandler(svc *service.Service) *Handler {
	return &Handler{
		RecycleHandler:  newRecycleHandler(svc.RecycleService),
		ResourceHandler: newResourceHandler(svc.ResourceService),
		FavoriteHandler: newFavoriteHandler(svc.FavoriteService),
	}
}
