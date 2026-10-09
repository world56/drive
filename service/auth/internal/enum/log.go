package enum

const (
	LogEventLogin      = "LOGIN"           // 用户登陆
	LogEventLogOut     = "LOG_OUT"         // 用户登出
	LogEventUserInsert = "USER_INSERT"     // 新增用户
	LogEventUserUpdate = "USER_UPDATE"     // 编辑用户信息
	LogEventUserStatus = "USER_STATUS"     // 用户状态变更（激活、冻结）
	LogEventPwdUpdate  = "USER_PWD_UPDATE" // 用户密码更新
)
