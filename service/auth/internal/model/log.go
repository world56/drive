package model

import (
	"time"

	"github.com/google/uuid"
)

type Log struct {
	ID         uuid.UUID `gorm:"type:uuid;primaryKey"`
	Event      string    `gorm:"type:varchar(32);not null;" json:"event"`
	Desc       string    `gorm:"type:text;" json:"desc"`
	OperatorId string    `gorm:"type:uuid;column:operator_id" json:"operatorId"`

	CreateTime time.Time `gorm:"column:create_time;autoCreateTime" json:"createTime"`
}
