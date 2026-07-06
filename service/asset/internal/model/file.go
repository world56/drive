package model

import (
	"common/idgen"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type File struct {
	ID         int64     `gorm:"type:bigint;primaryKey;autoIncrement:false;" json:"id,string"`
	Name       string    `gorm:"type:varchar(256);" json:"name"`
	FullName   string    `gorm:"type:varchar(256);not null;column:full_name;" json:"fullName"`
	Size       int64     `gorm:"type:bigint;default:0;" json:"size"`
	Type       int8      `gorm:"type:int2;not null" json:"type"`
	Suffix     *string   `gorm:"type:varchar(10);default:null;" json:"suffix"`
	ParentID   *int64    `gorm:"type:bigint;column:parent_id" json:"parentID"`
	PathIds    string    `gorm:"type:varchar(2048);index:idx_path_ids,type:btree;" json:"pathIds"`
	Remark     *string   `gorm:"type:varchar(256);default:null" json:"remark"`
	Count      int16     `gorm:"type:int2;default:0" json:"count"`
	CreatorID  uuid.UUID `gorm:"type:uuid;not null;column:creator_id;" json:"CreatorID"`
	Remove     int8      `gorm:"type:int2;default:0" json:"remove"`
	CreateTime time.Time `gorm:"column:create_time;autoCreateTime;" json:"createTime"`

	Parent   *File   `gorm:"foreignKey:ParentID;references:ID" json:"parent,omitempty"`
	Children *[]File `gorm:"foreignKey:ParentID;references:ID" json:"children,omitempty"`
}

func (f *File) BeforeCreate(tx *gorm.DB) error {
	if f.ID == 0 {
		f.ID = idgen.SnowflakeIDNext()
	}
	return nil
}
