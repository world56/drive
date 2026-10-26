package dto

import (
	"asset/internal/enum"
	"common/utils/jsontypes"
	"time"
)

type Favorite struct {
	ID         int64             `json:"id,string"`
	ResourceID int64             `json:"resourceId,string"`
	FullName   string            `json:"fullName"`
	Type       enum.ResourceType `json:"type"`
	Size       int64             `json:"size"`
	Suffix     *string           `json:"suffix"`
	ObjectName string            `json:"objectName"`
	Remove     int8              `json:"remove"`
	ParentID   *int64            `json:"parent_id"`
	CreateTime time.Time         `json:"createTime"`
}

type RequestFavorites struct {
	Type       []enum.ResourceType `form:"type" binding:"omitempty,dive,oneof=-1 0 1 2 3 4 5"`
	FullName   string              `form:"fullName" binding:"omitempty"`
	CreateTime enum.SortType       `form:"createTime" binding:"omitempty,oneof=ASC DESC"`
}

// type ResponseFavorites struct {
// 	List []Favorite `json:"list"`
// }

type RequestUpdateFavorites struct {
	IDs jsontypes.StringInt64Slice `form:"ids" binding:"required"`
}
