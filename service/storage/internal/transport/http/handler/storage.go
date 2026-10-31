package handler

import (
	"fmt"
	"io"
	"net/http"
	"strconv"

	request "common/http/request"
	"common/http/response"
	"storage/internal/dto"
	"storage/internal/service"
	"storage/internal/utils"

	"github.com/gin-gonic/gin"
)

type StorageHandler struct {
	storageService *service.StorageService
}

func newStorageHandler(s *service.StorageService) *StorageHandler {
	return &StorageHandler{storageService: s}
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

	objectName, err := s.storageService.Write(
		c.Request.Context(),
		request.GetCurrentUser(c).ID,
		stream,
		chunk.Chunk.Size,
		dto.File{
			ID:       chunk.ID,
			Name:     chunk.Name,
			Size:     chunk.Size,
			Path:     chunk.Path,
			Index:    chunk.Index,
			Total:    chunk.Total,
			ParentID: chunk.ParentID,
		})
	if err != nil {
		response.ServerError(c, err)
		return
	}
	response.Success(c, objectName)
}

func (s *StorageHandler) Read(c *gin.Context) {
	ctx := c.Request.Context()
	objectName := c.Param("ObjectName")

	size, contentType, err := s.storageService.Stat(ctx, objectName)
	if err != nil {
		response.ServerError(c, err)
		return
	}

	start, end, partial, ok := utils.ParseByteRange(c.GetHeader("Range"), size)
	if !ok {
		c.Header("Content-Range", fmt.Sprintf("bytes */%d", size))
		c.Status(http.StatusRequestedRangeNotSatisfiable)
		return
	}

	rs, re := int64(-1), int64(-1)
	if partial {
		rs, re = start, end
	}
	body, err := s.storageService.Open(ctx, objectName, rs, re)
	if err != nil {
		response.ServerError(c, err)
		return
	}
	defer body.Close()

	length := int64(0)
	if size > 0 {
		length = end - start + 1
	}

	c.Header("Accept-Ranges", "bytes")
	c.Header("Content-Type", contentType)
	c.Header("Content-Disposition", "inline; filename=\""+objectName+"\"")
	c.Header("Content-Length", strconv.FormatInt(length, 10))
	c.Header("Cache-Control", "public, max-age=31536000")

	status := http.StatusOK
	if partial {
		status = http.StatusPartialContent
		c.Header("Content-Range", fmt.Sprintf("bytes %d-%d/%d", start, end, size))
	}
	c.Status(status)
	_, _ = io.Copy(c.Writer, body)
}

func (s *StorageHandler) Download(c *gin.Context) {
	ctx := c.Request.Context()
	objectName, fullName, err := s.storageService.Download(ctx, c.Param("ID"), request.GetCurrentUser(c).ID)
	if err != nil {
		response.ServerError(c, err)
		return
	}

	size, contentType, err := s.storageService.Stat(ctx, objectName)
	if err != nil {
		response.ServerError(c, err)
		return
	}

	start, end, partial, ok := utils.ParseByteRange(c.GetHeader("Range"), size)
	if !ok {
		c.Header("Content-Range", fmt.Sprintf("bytes */%d", size))
		c.Status(http.StatusRequestedRangeNotSatisfiable)
		return
	}

	rs, re := int64(-1), int64(-1)
	if partial {
		rs, re = start, end
	}
	body, err := s.storageService.Open(ctx, objectName, rs, re)
	if err != nil {
		response.ServerError(c, err)
		return
	}
	defer body.Close()

	length := int64(0)
	if size > 0 {
		length = end - start + 1
	}

	c.Header("Accept-Ranges", "bytes")
	c.Header("Content-Type", contentType)
	c.Header("Content-Disposition", "attachment; filename=\""+fullName+"\"")
	c.Header("Content-Length", strconv.FormatInt(length, 10))

	status := http.StatusOK
	if partial {
		status = http.StatusPartialContent
		c.Header("Content-Range", fmt.Sprintf("bytes %d-%d/%d", start, end, size))
	}
	c.Status(status)
	_, _ = io.Copy(c.Writer, body)
}
