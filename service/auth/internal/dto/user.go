package dto

type User struct {
	Id      string `json:"id"`
	Name    string `json:"name"`
	Role    int    `json:"role"`
	Status  int    `json:"status"`
	Account string `json:"account"`
	Contact string `json:"contact"`
	Remark  string `json:"description"`
}

type RequestCreateUserDTO struct {
	Name     string `json:"name,omitempty" binding:"required"`
	Account  string `json:"account" binding:"required"`
	Password string `json:"password" binding:"required"`
	Contact  string `json:"contact,omitempty"`
	Remark   string `json:"description,omitempty"`
}

type RequestFindUsersQuery struct {
	PageTurnQuery
	Account *string `form:"account"`
	Name    *string `form:"name"`
}

type ResponseFindUsersDTO struct {
	Count int    `json:"count"`
	Users []User `json:"data"`
}

type RequestUpdateUser struct {
	Id      string `json:"id" binding:"required"`
	Name    string `json:"name,omitempty" binding:"required"`
	Contact string `json:"contact,omitempty"`
	Remark  string `json:"remark,omitempty"`
}

type RequestUpdatePassword struct {
	RequestFindStringPrimaryKey
	Pwd      string `json:"pwd" binding:"required"`      // 旧密码
	Password string `json:"password" binding:"required"` // 新密码
}

type ResponseUserLoginInfo struct {
	Id   string `json:"id"`
	Name string `json:"name"`
	Role int    `json:"role"`
}
