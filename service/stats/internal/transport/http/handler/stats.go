package handler

import (
	"common/http/response"
	"stats/internal/dto"
	"stats/internal/service"

	"github.com/gin-gonic/gin"
)

type StatsHandler struct {
	statsService *service.StatsService
}

func NewStatsHandler(s *service.StatsService) *StatsHandler {
	return &StatsHandler{
		statsService: s,
	}
}

// 系统存储
func (h *StatsHandler) GetStorage(c *gin.Context) {
	storage, err := h.statsService.FindStorage(c.Request.Context())
	if err != nil {
		response.ServerError(c, err)
	} else {
		response.Success(c, storage)
	}
}

// 访问趋势
func (h *StatsHandler) GetAccess(c *gin.Context) {
	trends, err := h.statsService.FindAccessTrends(c.Request.Context())
	if err != nil {
		response.ServerError(c, err)
	} else {
		response.Success(c, trends)
	}
}

// 热门查询
func (h *StatsHandler) GetHot(c *gin.Context) {
	hots, err := h.statsService.FindHot(c.Request.Context())
	if err != nil {
		response.ServerError(c, err)
	} else {
		response.Success(c, hots)
	}
}

// 记录查询
func (h *StatsHandler) UpdateHot(c *gin.Context) {
	var query dto.RequestHotLabel
	if err := c.ShouldBindQuery(&query); err != nil {
		response.ClientError(c, err)
		return
	}

	if err := h.statsService.UpdateHot(c.Request.Context(), query); err != nil {
		response.ServerError(c, err)
	} else {
		response.Success(c, true)
	}
}

// 近期上传、创建
func (h *StatsHandler) GetRecently(c *gin.Context) {
	response.Success(c, []interface{}{})
}

// 收藏排行
func (h *StatsHandler) GetFavorite(c *gin.Context) {
	response.Success(c, []interface{}{})
}
