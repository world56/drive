package handler

import "auth/internal/service"

type Handler struct {
	CryptoHandler  *CryptoHandler
	AccountHandler *AccountHandler
}

func NewHandler(svc *service.Server) *Handler {
	return &Handler{
		CryptoHandler:  NewCryptoHandler(svc.CryptoService),
		AccountHandler: NewAccountHandler(svc.AccountService),
	}
}
