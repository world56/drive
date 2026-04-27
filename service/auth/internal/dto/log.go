package dto

import (
	"time"
)

type Log struct {
	ID         string    `json:"id"`
	Event      string    `json:"event"`
	Desc       string    `json:"desc"`
	CreateTime time.Time `json:"createTime"`
	UserId     string    `json:"userId"`
}

type RequestFindLogsDTO struct {
	PageTurnQuery
	Event  *string `json:"event,omitempty"`
	UserId *string `json:"userId,omitempty"`
}

type ResponseFindLogsDTO struct {
	Count int64 `json:"count"`
	List  []Log `json:"list"`
}
