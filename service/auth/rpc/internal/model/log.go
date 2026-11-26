package model

import (
	"time"

	"common/idgen"

	"gorm.io/gorm"
)

type Log struct {
	Id         int64     `gorm:"column:id;type:bigint;primaryKey;autoIncrement:false;" json:"id,string"`
	Event      string    `gorm:"type:varchar(32);not null;index:user_id_event;" json:"event"`
	Desc       string    `gorm:"type:text;" json:"desc"`
	CreateTime time.Time `gorm:"column:create_time;index:idx_logs_create_time,sort:desc;" json:"createTime"`

	UserId int64 `gorm:"column:user_id;type:bigint;index:user_id_event;not null" json:"userId,string"`
}

func (l *Log) BeforeCreate(tx *gorm.DB) error {
	if l.Id == 0 {
		l.Id = idgen.SnowflakeIDNext()
	}
	return nil
}
