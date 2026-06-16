package enum

type UserRole = int
type UserStatus = int

const (
	UserRoleAdmin   UserRole = iota // 超级管理员
	UserRoleRegular                 // 普通用户
)

const (
	UserStatusFreeze UserStatus = iota // 冻结
	UserStatusActive                   // 激活（正常）
)
