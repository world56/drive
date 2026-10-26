package handler

import (
	"asset/internal/dto"
	"asset/internal/service"
	"common/http/request"
	"common/http/response"

	"github.com/gin-gonic/gin"
)

type FavoriteHandler struct {
	favoriteService *service.FavoriteService
}

func NewFavoriteHandler(f *service.FavoriteService) *FavoriteHandler {
	return &FavoriteHandler{
		favoriteService: f,
	}
}

func (f *FavoriteHandler) FindFavorites(c *gin.Context) {
	var query dto.RequestFavorites
	if err := c.ShouldBindQuery(&query); err != nil {
		response.ClientError(c, err)
		return
	}

	user := request.GetCurrentUser(c)
	favorites, err := f.favoriteService.GetFavorites(c.Request.Context(), user.ID, query)
	if err != nil {
		response.ServerError(c, err)
	} else {
		response.Success(c, favorites)
	}
}

func (f *FavoriteHandler) InsertFavorite(c *gin.Context) {
	var body dto.RequestUpdateFavorites
	if err := c.ShouldBindJSON(&body); err != nil {
		response.ClientError(c, err)
		return
	}

	user := request.GetCurrentUser(c)
	if err := f.favoriteService.InsertFavorite(c.Request.Context(), user.ID, body.IDs); err == nil {
		response.Success(c, true)
	} else {
		response.ServerError(c, err)
	}
}

func (f *FavoriteHandler) RemoveFavorite(c *gin.Context) {
	var body dto.RequestUpdateFavorites
	if err := c.ShouldBindJSON(&body); err != nil {
		response.ClientError(c, err)
		return
	}

	user := request.GetCurrentUser(c)
	if err := f.favoriteService.RemoveFavorite(c.Request.Context(), user.ID, body.IDs); err == nil {
		response.Success(c, true)
	} else {
		response.ServerError(c, err)
	}
}
