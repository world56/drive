package dto

type PageTurnQuery struct {
	CurrentPage int `form:"currentPage" json:"currentPage" binding:"required"`
	PageSize    int `form:"pageSize" json:"pageSize" binding:"required"`
}

type RequestFindIntPrimaryKey struct {
	Id int `form:"id" binding:"required"`
}
type RequestFindStringPrimaryKey struct {
	Id string `form:"id" binding:"required"`
}
