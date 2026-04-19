package handler

import "auth/internal/service"

type Handler struct {
	UserHandler    *UserHandler
	CryptoHandler  *CryptoHandler
	AccountHandler *AccountHandler
}

func NewHandler(svc *service.Server) *Handler {
	return &Handler{
		UserHandler:    NewUserHandler(svc.UserService),
		CryptoHandler:  NewCryptoHandler(svc.CryptoService),
		AccountHandler: NewAccountHandler(svc.AccountService),
	}
}
