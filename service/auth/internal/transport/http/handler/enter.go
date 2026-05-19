package handler

import "auth/internal/service"

type Handler struct {
	LogHandler     *LogHandler
	UserHandler    *UserHandler
	CryptoHandler  *CryptoHandler
	AccountHandler *AccountHandler
}

func NewHandler(svc *service.Server) *Handler {
	return &Handler{
		LogHandler:     NewLogHandler(svc.LogService),
		UserHandler:    NewUserHandler(svc.UserService),
		CryptoHandler:  NewCryptoHandler(svc.CryptoService),
		AccountHandler: NewAccountHandler(svc.AccountService),
	}
}
