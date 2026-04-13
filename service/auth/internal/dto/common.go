package dto

type PageTurnQuery struct {
	CurrentPage int `json:"currentPage" binding:"required"`
	PageSize    int `json:"pageSize" binding:"required"`
}
