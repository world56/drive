package handler

import (
	"storage/internal/dto"
	"storage/internal/service"

	"common/http/response"

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
	var chunk dto.Chunk
	if err := c.ShouldBind(&chunk); err != nil {
		response.ClientError(c, err)
		return
	}

	stream, err := chunk.Chunk.Open()
	if err != nil {
		response.ClientError(c, err)
		return
	}
	defer stream.Close()

}

func (s *StorageHandler) Read(c *gin.Context) {

}

func (s *StorageHandler) Download(c *gin.Context) {

}
