package handler

import (
	request "common/http/request"
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

	done, err := s.storageService.Write(
		c.Request.Context(),
		request.GetCurrentUser(c).ID,
		stream,
		chunkSize,
		dto.File{
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
	ObjectName := c.Param("ObjectName")

	object, io, err := s.storageService.Read(c.Request.Context(), ObjectName)
	if err != nil {
		response.ServerError(c, err)
		return
	}

	defer io.Close()

	c.DataFromReader(200, object.Size, object.ContentType, io, map[string]string{
		"Content-Disposition": "inline; filename=\"" + ObjectName + "\"",
		"Cache-Control":       "public, max-age=31536000",
	})
}

func (s *StorageHandler) Download(c *gin.Context) {

}
