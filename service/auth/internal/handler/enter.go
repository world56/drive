package handler

import "auth/internal/service"

type Handler struct {
	Crypto  *CryptoHandler
	Account *AccountHandler
}

func NewHandler(svc *service.Server) *Handler {
	return &Handler{
		Crypto:  NewCryptoHandler(svc.Crypto),
		Account: NewAccountHandler(svc.Account),
	}
}
