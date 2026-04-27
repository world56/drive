package model

import (
	"time"

	"github.com/google/uuid"
)

type Log struct {
	ID         uuid.UUID `gorm:"type:uuid;primaryKey;" json:"id"`
	Event      string    `gorm:"type:varchar(32);not null;index:user_id_event;" json:"event"`
	Desc       string    `gorm:"type:text;" json:"desc"`
	CreateTime time.Time `gorm:"column:create_time;autoCreateTime;" json:"createTime"`

	UserId uuid.UUID `gorm:"type:uuid;index:user_id_event;not null" json:"userId"`
}
