package ctxdata

import "context"

const CtxKeyOperatorId = "operatorId"

func OperatorId(ctx context.Context) string {
	if value, ok := ctx.Value(CtxKeyOperatorId).(string); ok {
		return value
	}

	return ""
}
