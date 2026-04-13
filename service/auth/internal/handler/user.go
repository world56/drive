package handler

import (
	"auth/internal/dto"
	"auth/internal/pkg/response"
	"auth/internal/service"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	UserServer *service.UserService
}

func NewUserHandler(u *service.UserService) *UserHandler {
	return &UserHandler{
		UserServer: u,
	}
}

func (s *UserHandler) getUsers(c *gin.Context) {
	var query dto.RequestFindUsersQuery
	if err := c.ShouldBindJSON(&query); err != nil {
		response.ClientError(c, err)
		return
	}
	data, err := s.UserServer.FindUsers(c.Request.Context(), query)
	if err != nil {
		response.ServerError(c, err)
	} else {
		response.Success(c, data)
	}
}
