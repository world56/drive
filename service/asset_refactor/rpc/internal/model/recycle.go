package model

import (
	"common/idgen"
	"time"

	"gorm.io/gorm"
)

type Recycle struct {
	Id         int64     `gorm:"type:bigint;primaryKey;autoIncrement:false;" json:"id,string"`
	UserId     string    `gorm:"type:uuid;column:user_id;uniqueIndex:user_resource,priority:1;" json:"userId"`
	ResourceId int64     `gorm:"type:bigint;uniqueIndex:user_resource,priority:2;" json:"resourceId"`
	CreateTime time.Time `gorm:"column:create_time;autoCreateTime;" json:"createTime"`
}

func (r *Recycle) BeforeCreate(tx *gorm.DB) error {
	if r.Id == 0 {
		r.Id = idgen.SnowflakeIDNext()
	}
	return nil
}
