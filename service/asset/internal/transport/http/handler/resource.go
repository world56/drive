package handler

import (
	"asset/internal/dto"
	"asset/internal/service"
	request "common/http/request"
	"common/http/response"

	"github.com/gin-gonic/gin"
)

type ResourceHandler struct {
	resourceService *service.ResourceService
}

func NewResourceHandler(r *service.ResourceService) *ResourceHandler {
	return &ResourceHandler{
		resourceService: r,
	}
}

// 查询-全部文件资源
func (s *ResourceHandler) SearchFiles(c *gin.Context) {
	var query dto.RequestSearchResourcesByName
	if err := c.ShouldBindQuery(&query); err != nil {
		response.ClientError(c, err)
		return
	}
	files, err := s.resourceService.SearchResourcesByName(c.Request.Context(), query)
	if err != nil {
		response.ServerError(c, err)
	} else {
		response.Success(c, files)
	}
}

// 查询-全部文件夹
func (s *ResourceHandler) FindFolders(c *gin.Context) {
	folders, err := s.resourceService.GetResourceFolders(c.Request.Context())
	if err != nil {
		response.ServerError(c, err)
	} else {
		response.Success(c, folders)
	}
}

// 查询-文件夹内资源列表
func (s *ResourceHandler) FindResources(c *gin.Context) {
	var query dto.RequestFiles
	if err := c.ShouldBindQuery(&query); err != nil {
		response.ClientError(c, err)
		return
	}

	files, err := s.resourceService.GetResources(c.Request.Context(), query)
	if err != nil {
		response.ServerError(c, err)
	} else {
		response.Success(c, files)
	}
}

// 查询-资源详情
func (s *ResourceHandler) FindResourceDetails(c *gin.Context) {
	var query dto.RequestResourceDetail
	if err := c.ShouldBindUri(&query); err != nil {
		response.ClientError(c, err)
		return
	}

	detail, err := s.resourceService.GetResourceDetail(c, query)
	if err != nil {
		response.ServerError(c, err)
	} else {
		response.Success(c, detail)
	}
}

// 新增-文件夹
func (s *ResourceHandler) MkdirFolder(c *gin.Context) {
	var data dto.RequestMkdirFolder
	if err := c.ShouldBindBodyWithJSON(&data); err != nil {
		response.ClientError(c, err)
		return
	}
	user := request.GetCurrentUser(c)
	bol, err := s.resourceService.MkdirFolder(c.Request.Context(), user.ID, data)
	if err != nil {
		response.ClientError(c, err)
	} else {
		response.Success(c, bol)
	}
}

// 编辑-资源信息
func (s *ResourceHandler) UpdateResourceInfo(c *gin.Context) {
	var body dto.RequestResourceUpdateInfo
	if err := c.ShouldBindJSON(&body); err != nil {
		response.ClientError(c, err)
		return
	}

	if err := s.resourceService.UpdateResourceInfo(c.Request.Context(), body); err != nil {
		response.ServerError(c, err)
	} else {
		response.Success(c, true)
	}
}

// 编辑-移动资源位置
func (s *ResourceHandler) UpdateResourcesLocation(c *gin.Context) {}

// 删除-移动至回收站
func (s *ResourceHandler) DeleteResources(c *gin.Context) {}
