package response

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// 正常返回
func Success(c *gin.Context, content interface{}) {
	c.JSON(http.StatusOK, content)
}

// 服务端的错误
func ServerError(c *gin.Context, err error) {
	c.JSON(http.StatusInternalServerError, err.Error())
}

// 客户端导致的错误
func ClientError(c *gin.Context, err error) {
	c.JSON(http.StatusBadRequest, err.Error())
}

// token 无效
func ClientLoginTimeout(c *gin.Context) {
	c.JSON(http.StatusUnauthorized, "Login Timeout")
}
