package handler

import (
	"auth/internal/pkg/response"
	"auth/internal/service"

	"github.com/gin-gonic/gin"
)

type AccountHandler struct {
	AccountService *service.AccountService
}

func NewAccountHandler(s *service.AccountService) *AccountHandler {
	return &AccountHandler{
		AccountService: s,
	}
}

// 是否存在超级管理员
func (h *AccountHandler) HasSuperAdmin(c *gin.Context) {
	has, err := h.AccountService.HasSuperAdmin()
	if err != nil {
		response.ServerError(c, err)
		return
	}
	response.Success(c, has)
}

// 注册超级管理员
func (h *AccountHandler) RegisterSuperAdmin(c *gin.Context) {
	body, err := c.GetRawData()
	if err != nil {
		response.ClientError(c, err)
		return
	} else if err := h.AccountService.Register(c.Request.Context(), body); err != nil {
		response.ServerError(c, err)
	} else {
		response.Success(c, true)
	}
}
