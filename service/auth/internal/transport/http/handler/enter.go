package handler

import "auth/internal/service"

type Handler struct {
	LogHandler     *LogHandler
	UserHandler    *UserHandler
	CryptoHandler  *CryptoHandler
	AccountHandler *AccountHandler
}

func NewHandler(svc *service.Service) *Handler {
	return &Handler{
		LogHandler:     newLogHandler(svc.LogService),
		UserHandler:    newUserHandler(svc.UserService),
		CryptoHandler:  newCryptoHandler(svc.CryptoService),
		AccountHandler: newAccountHandler(svc.AccountService),
	}
}
