package dto

type File struct {
	ID        string  `json:"id"`
	Name      string  `json:"name"`
	FullName  string  `json:"fullName"`
	Size      int64   `json:"size"`
	Type      int8    `json:"type"`
	Suffix    string  `json:"suffix"`
	ParentID  *string `json:"parentID"`
	Remark    *string `json:"remark"`
	Count     int16   `json:"count"`
	CreatorID string  `json:"creatorID"`
}

type Path struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type ReposesFiles struct {
	File
	Paths []Path `json:"paths"`
}

type RequestSearchFilesByName struct {
	Name      string  `form:"name" binding:"required"`
	Type      []int   `form:"type" binding:"omitempty,dive,oneof=-1 0 1 2 3 4 5"`                    // 资源类型
	Sort      *string `form:"sort" binding:"omitempty,oneof=DESC ASC"`                               // 排序方式
	StartTime *int64  `form:"startTime" binding:"omitempty,required_with=EndTime"`                   // 开始时间
	EndTime   *int64  `form:"endTime" binding:"omitempty,required_with=StartTime,gtfield=StartTime"` // 结束时间
}
