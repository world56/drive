package grpcclient

import (
	assetpb "api/auth"
	"context"
	"fmt"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

type AuthGrpcClient struct {
	conn *grpc.ClientConn
	user assetpb.UserServiceClient
}

func newAuthGrpcClient(authAddr string) (*AuthGrpcClient, error) {
	conn, err := grpc.NewClient(
		authAddr,
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	)
	if err != nil {
		return nil, err
	}

	return &AuthGrpcClient{
		conn: conn,
		user: assetpb.NewUserServiceClient(conn),
	}, nil
}

func (u *AuthGrpcClient) GetUserInfo(userID string) (*assetpb.User, error) {
	c, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	user, err := u.user.GetUserInfo(c, &assetpb.FindUserId{Id: userID})
	fmt.Println("grpc get user info:", user, err)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (u *AuthGrpcClient) Close() error {
	return u.conn.Close()
}
