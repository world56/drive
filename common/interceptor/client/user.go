package interceptor

import (
	"context"

	"google.golang.org/grpc"
	"google.golang.org/grpc/metadata"
)

func UnaryUser(
	c context.Context,
	method string,
	req, reply any,
	cc *grpc.ClientConn,
	invoker grpc.UnaryInvoker,
	opts ...grpc.CallOption,
) error {
	if id, ok := c.Value("user-id").(string); ok && id != "" {
		c = metadata.AppendToOutgoingContext(c, "user-id", id)
	}

	if role, ok := c.Value("user-role").(string); ok && role != "" {
		c = metadata.AppendToOutgoingContext(c, "user-role", role)
	}
	return invoker(c, method, req, reply, cc, opts...)
}
