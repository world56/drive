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

	chunkSize := chunk.Chunk.Size
	stream, err := chunk.Chunk.Open()
	if err != nil {
		response.ClientError(c, err)
		return
	}
	defer stream.Close()

	done, err := s.storageService.Write(c.Request.Context(), stream, chunkSize, dto.File{
		ID:       chunk.ID,
		Name:     chunk.Name,
		Size:     chunk.Size,
		Index:    chunk.Index,
		Total:    chunk.Total,
		ParentID: chunk.ParentID,
	})
	if err != nil {
		response.ServerError(c, err)
	} else {
		response.Success(c, done)
	}
}

func (s *StorageHandler) Read(c *gin.Context) {

}

func (s *StorageHandler) Download(c *gin.Context) {

}
