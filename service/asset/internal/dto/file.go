package dto

type SearchFilesByName struct {
	Name      string  `form:"name" binding:"required"`
	Type      []int   `form:"type" binding:"omitempty,dive,oneof=-1 0 1 2 3 4 5"`                    // 资源类型
	Sort      *string `form:"sort" binding:"omitempty,oneof=DESC ASC"`                               // 排序方式
	StartTime *int64  `form:"startTime" binding:"omitempty,required_with=EndTime"`                   // 开始时间
	EndTime   *int64  `form:"endTime" binding:"omitempty,required_with=StartTime,gtfield=StartTime"` // 结束时间
}
