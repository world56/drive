package handler

import (
	"asset/internal/dto"
	"asset/internal/service"
	"common/http/response"

	"github.com/gin-gonic/gin"
)

type FileHandler struct {
	fileService *service.FileService
}

func NewFileHandler(f *service.FileService) *FileHandler {
	return &FileHandler{
		fileService: f,
	}
}

// 查询-全部文件资源
func (s *FileHandler) SearchFiles(c *gin.Context) {
	var query dto.SearchFilesByName
	if err := c.ShouldBindQuery(&query); err != nil {
		response.ClientError(c, err)
		return
	}
	s.fileService.SearchFilesByName(c.Request.Context(), query)
}

// 查询-全部文件夹
func (s *FileHandler) FindFolders(c *gin.Context) {}

// 查询-文件夹内资源列表
func (s *FileHandler) FindFolderResources(c *gin.Context) {}

// 查询-资源详情
func (s *FileHandler) FindResourceDetails(c *gin.Context) {}

// 新增-文件夹
func (s *FileHandler) MkdirFolder(c *gin.Context) {}

// 编辑-资源信息
func (s *FileHandler) UpdateResourceInfo(c *gin.Context) {}

// 编辑-移动资源位置
func (s *FileHandler) UpdateResourcesLocation(c *gin.Context) {}

// 删除-移动至回收站
func (s *FileHandler) DeleteResources(c *gin.Context) {}
