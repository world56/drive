package handler

import (
	"auth/internal/service"
	"common/http/request"
	"common/http/response"
	"fmt"
	"net/http"

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
		c.SetSameSite(http.SameSiteLaxMode)
		c.SetCookie(
			"Authorization",
			token,
			3600*24,
			"/",
			"",
			false,
			false,
		)
		response.Success(c, true)
	}
}

// 获取用户登陆信息
func (h *AccountHandler) GetUserInfo(c *gin.Context) {
	fmt.Println(1)
	currentUser := request.GetCurrentUser(c)
	fmt.Println(2)
	userInfo, err := h.accountService.GetUserByID(c.Request.Context(), currentUser.ID)
	fmt.Println(3)
	if err != nil {
		response.ClientLoginTimeout(c)
	} else {
		response.Success(c, userInfo)
	}
}

// 退出登录
func (h *AccountHandler) Logout(c *gin.Context) {
	currentUser := request.GetCurrentUser(c)
	h.accountService.Logout(c.Request.Context(), currentUser.ID)

	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie(
		"Authorization",
		"",
		-1,
		"/",
		"",
		false,
		false,
	)
	response.Success(c, true)
}
