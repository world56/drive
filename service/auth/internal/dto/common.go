package dto

type PageTurnQuery struct {
	CurrentPage int64 `json:"currentPage" binding:"required"`
	PageSize    int64 `json:"pageSize" binding:"required"`
}
