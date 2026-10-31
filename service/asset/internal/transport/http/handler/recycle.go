package handler

import (
	"asset/internal/dto"
	"asset/internal/service"
	"common/http/request"
	"common/http/response"

	"github.com/gin-gonic/gin"
)

type RecycleHandler struct {
	recycleService *service.RecycleService
}

func newRecycleHandler(recycleService *service.RecycleService) *RecycleHandler {
	return &RecycleHandler{
		recycleService: recycleService,
	}
}

func (r *RecycleHandler) FindRecycles(c *gin.Context) {
	recycles, err := r.recycleService.GetRecycles(c.Request.Context())
	if err != nil {
		response.ServerError(c, err)
	} else {
		response.Success(c, recycles)
	}
}

func (r *RecycleHandler) MoveToRecycleBin(c *gin.Context) {
	var query dto.RequestRecycleIds
	if err := c.ShouldBindJSON(&query); err != nil {
		response.ClientError(c, err)
		return
	}

	user := request.GetCurrentUser(c)
	if err := r.recycleService.InsertResources(c.Request.Context(), user.ID, query.IDs); err != nil {
		response.ServerError(c, err)
	} else {
		response.Success(c, true)
	}
}

func (r *RecycleHandler) RemoveRecycleBinResource(c *gin.Context) {

}
