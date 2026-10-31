package model

import (
	"common/idgen"
	"time"

	"gorm.io/gorm"
)

type Recycle struct {
	ID         int64     `gorm:"type:bigint;primaryKey;autoIncrement:false;" json:"id,string"`
	UserID     string    `gorm:"type:uuid;column:user_id;uniqueIndex:user_resource,priority:1;" json:"userId"`
	ResourceID int64     `gorm:"type:bigint;uniqueIndex:user_resource,priority:2;" json:"resource_id"`
	CreateTime time.Time `gorm:"column:create_time;autoCreateTime;" json:"createTime"`
}

func (f *Recycle) BeforeCreate(t *gorm.DB) error {
	if f.ID == 0 {
		f.ID = idgen.SnowflakeIDNext()
	}
	return nil
}
