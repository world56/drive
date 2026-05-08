package dto

import (
	"time"
)

type Log struct {
	ID         string    `json:"id"`
	Event      string    `json:"event"`
	Desc       string    `json:"desc"`
	CreateTime time.Time `json:"createTime"`
	UserID     string    `json:"userID"`
}

type RequestFindLogsDTO struct {
	PageTurnQuery
	Event  *string `json:"event,omitempty"`
	UserID *string `json:"userID,omitempty"`
}

type ResponseFindLogsDTO struct {
	Count int64 `json:"count"`
	List  []Log `json:"list"`
}

type WriteLog struct {
	Event  string
	Desc   string
	UserID string
}
