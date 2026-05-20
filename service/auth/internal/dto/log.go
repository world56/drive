package dto

import (
	"auth/internal/pkg/utils"
	"time"
)

type Log struct {
	ID         string        `json:"id"`
	Event      string        `json:"event"`
	Desc       string        `json:"desc"`
	CreateTime time.Time     `json:"createTime"`
	UserID     string        `json:"userID"`
	User       UserBasicInfo `json:"user"`
}

type RequestFindLogsDTO struct {
	PageTurnQuery
	Event  *string `form:"event"`
	UserID *string `form:"userID"`
}

type ResponseFindLogsDTO struct {
	Count int64 `json:"count"`
	List  []Log `json:"list"`
}

type WriteLog struct {
	Event  string
	Desc   any
	UserID string
}

func (r *RequestFindLogsDTO) Normalize() {
	r.Event = utils.OptionalString(r.Event)
	r.UserID = utils.OptionalString(r.UserID)
}
