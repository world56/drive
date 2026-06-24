package handler

import (
	"storage/internal/service"

	"github.com/gin-gonic/gin"
)

type StorageHandler struct {
	storageService *service.StorageService
}

func newStorageHandler(s *service.StorageService) *StorageHandler {
	return &StorageHandler{
		storageService: s,
	}
}

func (s *StorageHandler) Write(c *gin.Context) {

}

func (s *StorageHandler) Read(c *gin.Context) {

}

func (s *StorageHandler) Download(c *gin.Context) {

}
