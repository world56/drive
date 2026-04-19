package dto

import "auth/internal/model"

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
	Count int          `json:"count"`
	Users []model.User `json:"data"`
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
