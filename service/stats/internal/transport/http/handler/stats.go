package handler

import (
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

}

// 访问趋势
func (h *StatsHandler) GetAccess(c *gin.Context) {

}

// 热门查询
func (h *StatsHandler) GetHot(c *gin.Context) {

}

func (h *StatsHandler) UpdateHot(c *gin.Context) {}

// 近期上传、创建
func (h *StatsHandler) GetRecently(c *gin.Context) {

}

// 收藏排行
func (h *StatsHandler) GetFavorite(c *gin.Context) {

}
