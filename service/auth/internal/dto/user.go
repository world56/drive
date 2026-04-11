package dto

type RequestCreateUserDTO struct {
	Name     string `json:"name,omitempty" bingding:"required"`
	Account  string `json:"account" bingding:"required"`
	Password string `json:"password" bingding:"required"`

	Email       string `json:"email,omitempty"`
	Phone       string `json:"phone,omitempty"`
	Description string `json:"description,omitempty"`
}

type RequestFindUsersQuery struct {
	PageTurnQuery
	Account *string `json:"account"`
	Name    *string `json:"name"`
}
