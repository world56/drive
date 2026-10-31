package dto

import (
	"asset/internal/enum"
	"common/utils/jsontypes"
	"time"
)

type Recycle struct {
	ID         int64             `json:"id,string"`
	ResourceID int64             `json:"resourceId,string"`
	FullName   string            `json:"fullName"`
	Type       enum.ResourceType `json:"type"`
	Size       int64             `json:"size"`
	Suffix     *string           `json:"suffix"`
	ObjectName string            `json:"objectName"`
	Remove     int8              `json:"remove"`
	ParentID   *int64            `json:"parentId,string"`
	CreateTime time.Time         `json:"createTime"`
	Count      *int64            `json:"count"`
	UserName   string            `json:"userName"`
}

type RequestRecycleIds struct {
	IDs jsontypes.StringInt64Slice `form:"ids" binding:"required"`
}
