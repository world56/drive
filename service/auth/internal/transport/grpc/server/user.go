package grpcserver

import (
	authpb "api/auth"
	"auth/internal/dto"
	"auth/internal/service"
	"context"
	"errors"
)

type UserGrpcServer struct {
	authpb.UnimplementedUserServiceServer
	userService *service.UserService
}

func NewUserGrpcServer(s *service.UserService) *UserGrpcServer {
	return &UserGrpcServer{
		userService: s,
	}
}

func (s *UserGrpcServer) GetUserInfo(c context.Context, r *authpb.FindUserId) (*authpb.User, error) {
	userID := r.GetId()
	if userID == "" {
		return nil, errors.New("User ID must not be empty")
	}

	user, err := s.userService.GetUserByID(c, dto.RequestFindStringPrimaryKey{ID: userID})
	if err != nil {
		return nil, err
	}

	return &authpb.User{
		Id:   user.ID,
		Name: user.Name,
	}, nil
}
