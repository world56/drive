package dto

import "mime/multipart"

type File struct {
	ID         string `form:"id" json:"id" binding:"required" redis:"ID"`
	Name       string `form:"name" json:"name" binding:"required" redis:"Name"`
	Index      int    `form:"index" json:"index" binding:"required" redis:"Index"`
	Total      int    `form:"total" json:"total" binding:"required" redis:"Total"`
	Size       int64  `form:"size" json:"size" binding:"required" redis:"Size"`
	ParentID   *int64 `form:"parentId" json:"parentId" redis:"ParentID"`
	UploadID   string `form:"minioId" json:"minioId" redis:"MinioID"`
	ObjectName string `redis:"ObjectName"`
}

type Chunk struct {
	Chunk *multipart.FileHeader `form:"chunk" binding:"required"`
	File
}
