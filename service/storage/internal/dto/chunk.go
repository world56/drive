package dto

import "mime/multipart"

type Chunk struct {
	ID       string                `form:"id" json:"id" binding:"required"`
	Name     string                `form:"name" json:"name" binding:"required"`
	Index    int                   `form:"index" json:"index" binding:"required"`
	Total    int                   `form:"total" json:"total" binding:"required"`
	Size     int64                 `form:"size" json:"size" binding:"required"`
	ParentID string                `form:"parentId" json:"parentId"`
	Chunk    *multipart.FileHeader `form:"chunk" binding:"required"`
}
