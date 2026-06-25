package dto

type Chunk struct {
	ID      string `json:"id" binding:"required"`
	Name    string `json:"name" binding:"required"`
	Index   int    `json:"index" binding:"required"`
	Total   int    `json:"total" binding:"required"`
	Size    int64  `json:"size" binding:"required"`
	Segment int    `json:"segment" binding:"required"`
	Chunk   []byte `json:"-" binding:"required"`
}
