package model

import (
	"time"

	"github.com/google/uuid"
)

type Log struct {
	Id         uuid.UUID `gorm:"column:id;type:uuid;default:gen_random_uuid();primaryKey;" json:"id"`
	Event      string    `gorm:"type:varchar(32);not null;index:user_id_event;" json:"event"`
	Desc       string    `gorm:"type:text;" json:"desc"`
	CreateTime time.Time `gorm:"column:create_time;autoCreateTime;" json:"createTime"`

	UserId string `gorm:"column:user_id;type:char(36);index:user_id_event;not null" json:"userId"`
	User   *User  `gorm:"foreignKey:UserId;references:Id;" json:"user"`
}
