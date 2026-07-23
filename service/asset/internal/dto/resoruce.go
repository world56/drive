package dto

import "asset/internal/enum"

type Resource struct {
	ID         string  `json:"id"`
	Name       string  `json:"name"`
	FullName   string  `json:"fullName"`
	Size       int64   `json:"size"`
	Type       int8    `json:"type"`
	Suffix     string  `json:"suffix"`
	ParentID   *int64  `json:"parentId,string"`
	Remark     *string `json:"remark"`
	Count      int16   `json:"count"`
	CreatorID  string  `json:"creatorId"`
	CreateTime string  `json:"createTime"`
}

type Path struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type ReposesResources struct {
	Resource
	Paths []Path `json:"paths"`
}

type RequestFiles struct {
	ID    *string           `form:"id,omitempty"`
	Order enum.SortType     `form:"order" binding:"oneof=ASC DESC"`
	Type  enum.ResourceSort `form:"type" binding:"oneof=SORT_NAME SORT_SIZE SORT_SUFFIX SORT_TYPE SORT_CREATOR_ID SORT_CREATE_TIME"`
}

type RequestSearchResourcesByName struct {
	Name      string  `form:"name" binding:"required"`
	Type      []int   `form:"type" binding:"omitempty,dive,oneof=-1 0 1 2 3 4 5"`                    // 资源类型
	Sort      *string `form:"sort" binding:"omitempty,oneof=DESC ASC"`                               // 排序方式
	StartTime *int64  `form:"startTime" binding:"omitempty,required_with=EndTime"`                   // 开始时间
	EndTime   *int64  `form:"endTime" binding:"omitempty,required_with=StartTime,gtfield=StartTime"` // 结束时间
}

type RequestMkdirFolder struct {
	Name     string  `json:"name" binding:"required"`
	Remark   *string `json:"remark,omitempty"`
	ParentID *int64  `json:"parentId,omitempty"`
}

type RequestResourceDetail struct {
	ID int64 `uri:"id" binding:"required"`
}

type RequestResourceUpdateInfo struct {
	ID       string  `json:"id" binding:"required"`
	Name     string  `json:"name" binding:"required"`
	ParentID *int64  `json:"parentId,string"`
	Remark   *string `json:"remark"`
}

type RequestDeleteFiles struct {
	IDs []string `form:"ids" json:"ids" binding:"required"`
}
