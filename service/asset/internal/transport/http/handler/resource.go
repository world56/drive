package handler

import (
	"asset/internal/dto"
	"asset/internal/service"
	"common/http/response"

	"github.com/gin-gonic/gin"
)

type ResourceHandler struct {
	fileService *service.ResourceService
}

func NewResourceHandler(f *service.ResourceService) *ResourceHandler {
	return &ResourceHandler{
		fileService: f,
	}
}

// 查询-全部文件资源
func (s *ResourceHandler) SearchFiles(c *gin.Context) {
	var query dto.RequestSearchResourcesByName
	if err := c.ShouldBindQuery(&query); err != nil {
		response.ClientError(c, err)
		return
	}
	s.fileService.SearchResourcesByName(c.Request.Context(), query)
}

// 查询-全部文件夹
func (s *ResourceHandler) FindFolders(c *gin.Context) {}

// 查询-文件夹内资源列表
func (s *ResourceHandler) FindFolderResources(c *gin.Context) {}

// 查询-资源详情
func (s *ResourceHandler) FindResourceDetails(c *gin.Context) {}

// 新增-文件夹
func (s *ResourceHandler) MkdirFolder(c *gin.Context) {
	var data dto.RequestMkdirFolder
	if err := c.ShouldBindBodyWithJSON(&data); err != nil {
		response.ClientError(c, err)
		return
	}

	s.fileService.MkdirFolder(c.Request.Context(), data)
}

// 编辑-资源信息
func (s *ResourceHandler) UpdateResourceInfo(c *gin.Context) {}

// 编辑-移动资源位置
func (s *ResourceHandler) UpdateResourcesLocation(c *gin.Context) {}

// 删除-移动至回收站
func (s *ResourceHandler) DeleteResources(c *gin.Context) {}
