package middleware

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log/slog"
	"net"
	"net/http"
	"os"
	"strconv"
	"time"

	chimw "github.com/go-chi/chi/v5/middleware"
	"github.com/lmittmann/tint"
	"github.com/mattn/go-isatty"
)

type ctxKey int

const upstreamKey ctxKey = 1

// 上游请求信息，供 access log 使用
type Upstream struct {
	Addr   string
	Status int
	Time   time.Duration
}

func WithUpstream(ctx context.Context) (context.Context, *Upstream) {
	u := &Upstream{}
	return context.WithValue(ctx, upstreamKey, u), u
}

func UpstreamFrom(ctx context.Context) *Upstream {
	u, _ := ctx.Value(upstreamKey).(*Upstream)
	return u
}

func NewLogger(local bool) *slog.Logger {
	if local {
		w := os.Stdout
		return slog.New(tint.NewTextHandler(w, &tint.Options{
			Level:      slog.LevelInfo,
			TimeFormat: time.TimeOnly,
			NoColor:    !isatty.IsTerminal(w.Fd()),
		})).With("app", "gateway")
	}

	return slog.New(slog.NewJSONHandler(os.Stdout, nil)).With("app", "gateway")
}

// 请求 ID
func RequestID(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		id := r.Header.Get(chimw.RequestIDHeader)
		if id == "" {
			var b [8]byte
			_, _ = rand.Read(b[:])
			id = hex.EncodeToString(b[:])
		}

		ctx := context.WithValue(r.Context(), chimw.RequestIDKey, id)
		w.Header().Set(chimw.RequestIDHeader, id)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// 访问日志
func AccessLog(jsonMode bool) func(http.Handler) http.Handler {
	color := !jsonMode && isatty.IsTerminal(os.Stdout.Fd())

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			start := time.Now()
			ctx, _ := WithUpstream(r.Context())
			r = r.WithContext(ctx)

			ww := chimw.NewWrapResponseWriter(w, r.ProtoMajor)
			next.ServeHTTP(ww, r)

			status := ww.Status()
			if status == 0 {
				status = 200
			}

			upAddr, upStatus, upTime := "-", "-", "-"
			if u := UpstreamFrom(r.Context()); u != nil && u.Addr != "" {
				upAddr = u.Addr
				if u.Status > 0 {
					upStatus = strconv.Itoa(u.Status)
				}
				upTime = fmt.Sprintf("%.3f", u.Time.Seconds())
			}

			if jsonMode {
				_ = json.NewEncoder(os.Stdout).Encode(map[string]interface{}{
					"time":       start.Format(time.RFC3339),
					"client":     clientIP(r),
					"method":     r.Method,
					"path":       r.URL.RequestURI(),
					"status":     status,
					"bytes":      ww.BytesWritten(),
					"req":        time.Since(start).Seconds(),
					"upstream":   upAddr,
					"up":         upStatus,
					"up_time":    upTime,
					"request_id": chimw.GetReqID(r.Context()),
				})
				return
			}

			ts := start.Format("2006-01-02 15:04:05")
			reqS := fmt.Sprintf("%.3f", time.Since(start).Seconds())
			method := r.Method
			st := strconv.Itoa(status)

			if color {
				upAddr = "\033[1;36m" + upAddr + "\033[0m"
				method = methodColor(r.Method) + "\033[1m" + r.Method + "\033[0m"
				st = statusColor(status) + "\033[1m" + st + "\033[0m"
				if n, err := strconv.Atoi(upStatus); err == nil {
					upStatus = statusColor(n) + "\033[1m" + upStatus + "\033[0m"
				}
				ts = "\033[2m" + ts + "\033[0m"
				reqS = "\033[2m" + reqS + "\033[0m"
			}

			fmt.Printf("%s [%s] %s %s %s %s client=%s bytes=%d req=%ss up=%s up_time=%ss id=%s\n",
				upAddr, ts, method, st, r.URL.RequestURI(), r.Proto,
				clientIP(r), ww.BytesWritten(), reqS, upStatus, upTime,
				chimw.GetReqID(r.Context()),
			)
		})
	}
}

func methodColor(m string) string {
	switch m {
	case http.MethodGet, http.MethodHead:
		return "\033[36m"
	case http.MethodPost:
		return "\033[32m"
	case http.MethodPut, http.MethodPatch:
		return "\033[33m"
	case http.MethodDelete:
		return "\033[31m"
	default:
		return "\033[35m"
	}
}

func statusColor(s int) string {
	switch {
	case s >= 500:
		return "\033[31m"
	case s >= 400:
		return "\033[33m"
	case s >= 300:
		return "\033[34m"
	default:
		return "\033[32m"
	}
}

func clientIP(r *http.Request) string {
	if ip := chimw.GetClientIP(r.Context()); ip != "" {
		return ip
	}

	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return host
}
