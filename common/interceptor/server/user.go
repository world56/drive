package interceptor

import (
	"context"

	"google.golang.org/grpc"
	"google.golang.org/grpc/metadata"
)

func UnaryUser(
	c context.Context,
	req any,
	info *grpc.UnaryServerInfo,
	handler grpc.UnaryHandler,
) (any, error) {
	if md, ok := metadata.FromIncomingContext(c); ok {
		if id := md.Get("user-id"); len(id) > 0 && id[0] != "" {
			c = context.WithValue(c, "user-id", id[0])
		}
		if role := md.Get("user-role"); len(role) > 0 && role[0] != "" {
			c = context.WithValue(c, "user-role", role[0])
		}
	}
	return handler(c, req)
}
