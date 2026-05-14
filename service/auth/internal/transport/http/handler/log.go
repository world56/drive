package handler

import (
	"auth/internal/dto"
	"auth/internal/service"
	"auth/internal/transport/http/response"

	"github.com/gin-gonic/gin"
)

type LogHandler struct {
	logService *service.LogService
}

func NewLogHandler(s *service.LogService) *LogHandler {
	return &LogHandler{
		logService: s,
	}
}

// 查询日志列表
func (s *LogHandler) GetLogs(c *gin.Context) {
	var query dto.RequestFindLogsDTO
	if err := c.ShouldBindJSON(&query); err != nil {
		response.ClientError(c, err)
		return
	}
	data, err := s.logService.FindLogs(c.Request.Context(), query)
	if err != nil {
		response.ServerError(c, err)
	} else {
		response.Success(c, data)
	}
}
