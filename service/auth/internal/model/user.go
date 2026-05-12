package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UserRole = int
type UserStatus = int

const (
	UserRoleReg UserRole = iota
	UserRoleAdmin
)

const (
	UserStatusFreeze UserStatus = iota
	UserStatusActive            = 1
)

type User struct {
	ID         uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid();" json:"id"`
	Name       string    `gorm:"type:varchar(6);uniqueIndex;not null;" json:"name"`
	Account    string    `gorm:"type:varchar(12);unique;not null;index:account_password;" json:"account"`
	Password   string    `gorm:"type:varchar(255);not null;index:account_password;" json:"password"`
	Status     int       `gorm:"type:int;not null;default:0;" json:"status"`     // 1:正常 0:禁用
	Role       int       `gorm:"type:int;not null;default:0;index;" json:"role"` // 0:普通用户 1:管理员
	Contact    string    `gorm:"type:varchar(30);" json:"contact"`               // 联系方式
	Avatar     string    `gorm:"type:varchar(16)" json:"avatar"`
	Remark     string    `gorm:"type:varchar(30);" json:"remark"` // 备注
	CreateTime time.Time `gorm:"column:create_time;autoCreateTime" json:"createTime"`

	Logs []Log `gorm:"foreignKey:UserID"`
}

func (u *User) BeforeCreate(db *gorm.DB) error {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return nil
}
