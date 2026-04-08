package response

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

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
