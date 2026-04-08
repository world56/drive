package handler

import (
	"auth/internal/pkg/response"
	"auth/internal/service"

	"github.com/gin-gonic/gin"
)

type CryptoHandler struct {
	cryptoService *service.CryptoService
}

func NewCryptoHandler(c *service.CryptoService) *CryptoHandler {
	return &CryptoHandler{
		cryptoService: c,
	}
}

// 获取密钥
func (h *CryptoHandler) GetSecret(c *gin.Context) {
	public, err := h.cryptoService.GetKey(c)
	if err != nil {
		response.ServerError(c, err)
		return
	}
	response.Success(c, public)
}
