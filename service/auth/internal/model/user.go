package model

import "gorm.io/gorm"

type UserRole = int

const (
	RoleReg UserRole = iota
	RoleAdmin
)

type User struct {
	gorm.Model
	Account     string `gorm:"type:varchar(12);unique;not null;" json:"account"`
	Password    string `gorm:"type:char(32);not null;" json:"password"`
	Name        string `gorm:"type:varchar(6);uniqueIndex;not null;" json:"name"`
	Email       string `gorm:"type:varchar(30);" json:"email"`
	Phone       string `gorm:"type:char(11);" json:"phone"`
	Avatar      string `gorm:"type:varchar(16)" json:"avatar"`
	Role        int    `gorm:"type:int;not null;default:0;" json:"role"` // 0:普通用户 1:管理员
	Description string `gorm:"type:varchar(30);" json:"description"`     // 用户备注
}
