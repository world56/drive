package handler

import (
	"auth/internal/pkg/request"
	"auth/internal/pkg/response"
	"auth/internal/service"

	"github.com/gin-gonic/gin"
)

type AccountHandler struct {
	accountService *service.AccountService
}

func NewAccountHandler(s *service.AccountService) *AccountHandler {
	return &AccountHandler{
		accountService: s,
	}
}

// 是否存在超管
func (h *AccountHandler) HasSuperAdmin(c *gin.Context) {
	has, err := h.accountService.HasSuperAdmin()
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
	} else if err := h.accountService.Register(c.Request.Context(), body); err != nil {
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

	token, err := h.accountService.Login(c.Request.Context(), body)
	if err != nil {
		response.ClientError(c, err)
	} else {
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
}

// 获取用户登陆信息
func (h *AccountHandler) getUserInfo(c *gin.Context) {
	user := request.GetUserInfo(c)
	h.accountService.GetUserInfo(c.Request.Context(), user.Auth)
}
