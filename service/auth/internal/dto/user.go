package dto

import (
	"auth/internal/pkg/utils"
	"time"
)

type User struct {
	ID         string    `json:"id"`
	Name       string    `json:"name"`
	Role       int       `json:"role"`
	Status     int       `json:"status"`
	Account    string    `json:"account"`
	Contact    string    `json:"contact"`
	Remark     string    `json:"remark"`
	CreateTime time.Time `json:"createTime"`
}

type UserBasicInfo struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type RequestCreateUserDTO struct {
	Name     string `json:"name,omitempty" binding:"required"`
	Account  string `json:"account" binding:"required"`
	Password string `json:"password" binding:"required"`
	Contact  string `json:"contact,omitempty"`
	Remark   string `json:"remark,omitempty"`
}

type RequestFindUsersQuery struct {
	PageTurnQuery
	Account *string `form:"account"`
	Name    *string `form:"name"`
	Status  *int    `form:"status"`
}

type ResponseFindUsersDTO struct {
	Count int64  `json:"count"`
	List  []User `json:"list"`
}

type RequestUpdateUser struct {
	ID      string `json:"id" binding:"required"`
	Name    string `json:"name,omitempty" binding:"required"`
	Contact string `json:"contact,omitempty"`
	Remark  string `json:"remark,omitempty"`
}

type RequestUpdatePassword struct {
	ID       string `json:"id" binding:"required"`
	Pwd      string `json:"pwd" binding:"required"`      // 旧密码
	Password string `json:"password" binding:"required"` // 新密码
}

type RequestAdminSetUserPassword struct {
	ID       string `json:"id" binding:"required"`
	Password string `json:"password" binding:"required"` // 新密码
}

type ResponseUserLoginInfo struct {
	ID      string `json:"id"`
	Name    string `json:"name"`
	Role    int    `json:"role"`
	Account string `json:"account"`
}

func (q *RequestFindUsersQuery) Normalize() {
	q.Account = utils.OptionalString(q.Account)
	q.Name = utils.OptionalString(q.Name)
}
