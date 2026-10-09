package handler

import "storage/internal/service"

type Handler struct {
	StorageHandler *StorageHandler
}

func NewHandler(svc *service.Service) *Handler {
	return &Handler{
		StorageHandler: newStorageHandler(svc.StorageService),
	}
}
