package handler

import "asset/internal/service"

type Handler struct {
	FileHandler *FileHandler
}

func NewHandler(svc *service.Service) *Handler {
	return &Handler{
		FileHandler: NewFileHandler(svc.FileService),
	}
}
