package handler

import (
	"auth/internal/dto"
	"auth/internal/service"
	"auth/internal/transport/http/request"
	"auth/internal/transport/http/response"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	userServer *service.UserService
}

func NewUserHandler(u *service.UserService) *UserHandler {
	return &UserHandler{
		userServer: u,
	}
}

// 查询用户列表
func (s *UserHandler) GetUsers(c *gin.Context) {
	var query dto.RequestFindUsersQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		response.ClientError(c, err)
		return
	}
	query.Normalize()
	data, err := s.userServer.FindUsers(c.Request.Context(), query)
	if err != nil {
		response.ServerError(c, err)
	} else {
		response.Success(c, data)
	}
}

// 获取全部用户
func (h *UserHandler) GetAllUsers(c *gin.Context) {
	data, err := h.userServer.GetAllUsers(c.Request.Context())
	if err != nil {
		response.ServerError(c, err)
	} else {
		response.Success(c, data)
	}
}

// 获取用户详情
func (h *UserHandler) GetUserInfo(c *gin.Context) {
	var query dto.RequestFindStringPrimaryKey
	if err := c.ShouldBindQuery(&query); err != nil {
		response.ClientError(c, err)
		return
	}

	user, err := h.userServer.GetUserInfo(c.Request.Context(), query)
	if err != nil {
		response.ServerError(c, err)
		return
	}

	response.Success(c, user)
}

// 新增用户
func (h *UserHandler) InsertUser(c *gin.Context) {
	var body dto.RequestCreateUserDTO
	if err := c.ShouldBindBodyWithJSON(&body); err != nil {
		response.ClientError(c, err)
		return
	}

	user := request.GetCurrentUser(c)
	success, err := h.userServer.InsertUser(c.Request.Context(), body, user.ID)
	if err != nil {
		response.ServerError(c, err)
	} else {
		response.Success(c, success)
	}
}

// 编辑用户
func (h *UserHandler) UpdateUserInfo(c *gin.Context) {
	var body dto.RequestUpdateUser
	if err := c.ShouldBindJSON(&body); err != nil {
		response.ClientError(c, err)
		return
	}
	success, err := h.userServer.UpdateUser(c.Request.Context(), body)
	if err != nil {
		response.ServerError(c, err)
	} else {
		response.Success(c, success)
	}
}

// 编辑状态
func (h *UserHandler) ChangeStatus(c *gin.Context) {
	var body dto.RequestFindStringPrimaryKey
	if err := c.ShouldBindJSON(&body); err != nil {
		response.ClientError(c, err)
		return
	}

	currentUser := request.GetCurrentUser(c)
	update, err := h.userServer.ChangeStatus(c.Request.Context(), body, currentUser.ID)
	if err != nil {
		response.ServerError(c, err)
	} else {
		response.Success(c, update)
	}
}

// 用户修改自己密码
func (h *UserHandler) ChangePassword(c *gin.Context) {
	body, err := c.GetRawData()
	if err != nil {
		response.ClientError(c, err)
		return
	}

	currentUser := request.GetCurrentUser(c)
	success, err := h.userServer.ChangePassword(c.Request.Context(), body, currentUser.ID)
	if err != nil {
		response.ServerError(c, err)
	} else {
		response.Success(c, success)
	}
}

// 超级管理员重置用户密码
func (h *UserHandler) AdminSetUserPassword(c *gin.Context) {
	body, err := c.GetRawData()
	if err != nil {
		response.ClientError(c, err)
		return
	}

	currentUser := request.GetCurrentUser(c)
	success, err := h.userServer.AdminSetUserPassword(c.Request.Context(), body, currentUser.ID)
	if err != nil {
		response.ServerError(c, err)
	} else {
		response.Success(c, success)
	}
}
