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

// 是否存在超管
func (h *AccountHandler) HasSuperAdmin(c *gin.Context) {
	has, err := h.AccountService.HasSuperAdmin()
	if err != nil {
		response.ServerError(c, err)
	} else {
		response.Success(c, has)
	}
}

// 注册超管
func (h *AccountHandler) Register(c *gin.Context) {
	body, err := c.GetRawData()
	if err != nil {
		response.ClientError(c, err)
	} else if err := h.AccountService.Register(c.Request.Context(), body); err != nil {
		response.ServerError(c, err)
	} else {
		response.Success(c, true)
	}
}

// 登录
func (h *AccountHandler) Login(c *gin.Context) {
	body, err := c.GetRawData()
	if err != nil {
		response.ClientError(c, err)
		return
	}

	token, err := h.AccountService.Login(c.Request.Context(), body)
	if err != nil {
		response.ClientError(c, err)
		return
	}

	c.SetCookie(
		"Authorization",
		token,
		3600*24,
		"/",
		"",
		false,
		true,
	)
	response.Success(c, true)
}
