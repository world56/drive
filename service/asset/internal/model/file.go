package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type File struct {
	ID         uuid.UUID  `gorm:"type:uuid;primaryKey;default:gen_random_uuid();" json:"id"`
	Name       string     `gorm:"type:varchar(256);" json:"name"`
	Path       *string    `gorm:"type:varchar(60);default:null;" json:"path"`
	FullName   string     `gorm:"type:varchar(256);not null;column:full_name;" json:"fullName"`
	Size       int64      `gorm:"type:bigint;default:0;" json:"size"`
	Type       int8       `gorm:"type:int2;not null" json:"type"`
	Suffix     *string    `gorm:"type:varchar(10);default:null;" json:"suffix"`
	ParentId   *uuid.UUID `gorm:"type:uuid;column:parent_id" json:"parentId"`
	Remark     *string    `gorm:"type:varchar(256);default:null" json:"remark"`
	Count      int16      `gorm:"type:int2;default:0" json:"count"`
	CreatorId  uuid.UUID  `gorm:"type:uuid;not null;column:creator_id;" json:"creatorId"`
	Remove     int8       `gorm:"type:int2;default:0" json:"remove"`
	CreateTime time.Time  `gorm:"column:create_time;autoCreateTime;" json:"createTime"`

	Parent   *File   `gorm:"foreignKey:ParentId;references:ID" json:"parent,omitempty"`
	Children *[]File `gorm:"foreignKey:ParentId;references:ID" json:"children,omitempty"`
}

func (u *File) BeforeCreate(db *gorm.DB) error {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return nil
}
