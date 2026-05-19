package model

import (
	"time"

	"github.com/google/uuid"
)

const (
	LogEventLogin      = "LOGIN"           // 用户登陆
	LogEventLogOut     = "LOG_OUT"         // 用户登出
	LogEventUserInsert = "USER_INSERT"     // 新增用户
	LogEventUserUpdate = "USER_UPDATE"     // 编辑用户信息
	LogEventUserStatus = "USER_STATUS"     // 用户状态变更（激活、冻结）
	LogEventPwdUpdate  = "USER_PWD_UPDATE" // 用户密码更新
)

type Log struct {
	ID         uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey;" json:"id"`
	Event      string    `gorm:"type:varchar(32);not null;index:user_id_event;" json:"event"`
	Desc       string    `gorm:"type:text;" json:"desc"`
	CreateTime time.Time `gorm:"column:create_time;autoCreateTime;" json:"createTime"`

	UserID string `gorm:"type:varchar(32);index:user_id_event;not null" json:"userID"`
}
