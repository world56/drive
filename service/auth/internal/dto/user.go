package dto

import "auth/internal/model"

type RequestCreateUserDTO struct {
	Name     string `json:"name,omitempty" binding:"required"`
	Account  string `json:"account" binding:"required"`
	Password string `json:"password" binding:"required"`

	Email       string `json:"email,omitempty"`
	Phone       string `json:"phone,omitempty"`
	Description string `json:"description,omitempty"`
}

type RequestFindUsersQuery struct {
	PageTurnQuery
	Account *string `json:"account"`
	Name    *string `json:"name"`
}

type ResponseFindUsersDTO struct {
	Count int          `json:"count"`
	Users []model.User `json:"data"`
}
