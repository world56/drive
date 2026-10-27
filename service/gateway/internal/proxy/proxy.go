package proxy

import (
	"bytes"
	"encoding/json"
	"io"
	"mime"
	"net"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strconv"
	"strings"
	"time"

	"gateway/internal/config"
	"gateway/internal/middleware"
)

func SharedTransport() *http.Transport {
	return &http.Transport{
		Proxy: http.ProxyFromEnvironment,
		DialContext: (&net.Dialer{
			Timeout:   10 * time.Second,
			KeepAlive: 60 * time.Second,
		}).DialContext,
		ForceAttemptHTTP2:   true,
		MaxIdleConns:        512,
		MaxIdleConnsPerHost: 128,
		IdleConnTimeout:     90 * time.Second,
		TLSHandshakeTimeout: 10 * time.Second,
	}
}

// 创建反代：剥前缀、转发 Cookie Authorization、包装 JSON/text
func New(route config.Route, tr http.RoundTripper) (http.Handler, error) {
	target, err := url.Parse(route.Upstream)
	if err != nil {
		return nil, err
	}

	prefix := strings.TrimSuffix(route.Prefix, "/")

	rp := httputil.NewSingleHostReverseProxy(target)
	rp.Transport = &wrapTransport{base: tr, addr: target.Host}
	rp.FlushInterval = 100 * time.Millisecond

	rp.ErrorHandler = func(w http.ResponseWriter, r *http.Request, err error) {
		if u := middleware.UpstreamFrom(r.Context()); u != nil {
			u.Addr = target.Host
			u.Status = 503
		}
		writeJSON(w, 503, err.Error())
	}

	rp.Director = func(req *http.Request) {
		req.URL.Scheme = target.Scheme
		req.URL.Host = target.Host
		req.Host = target.Host

		if cookie, err := req.Cookie("Authorization"); err == nil && cookie.Value != "" {
			req.Header.Set("Authorization", cookie.Value)
		}

		path := req.URL.Path
		if path == prefix || strings.HasPrefix(path, prefix+"/") {
			path = strings.TrimPrefix(path, prefix)
			if path == "" {
				path = "/"
			}
			req.URL.Path = path
		}

		req.RequestURI = ""
	}

	return rp, nil
}

type wrapTransport struct {
	base http.RoundTripper
	addr string
}

func (t *wrapTransport) RoundTrip(req *http.Request) (*http.Response, error) {
	start := time.Now()
	resp, err := t.base.RoundTrip(req)

	if u := middleware.UpstreamFrom(req.Context()); u != nil {
		u.Addr = t.addr
		u.Time = time.Since(start)
		if resp != nil {
			u.Status = resp.StatusCode
		}
	}

	if err != nil || resp == nil {
		return resp, err
	}

	mt, _, _ := mime.ParseMediaType(resp.Header.Get("Content-Type"))
	if mt != "application/json" && mt != "text/plain" {
		return resp, nil
	}

	raw, err := io.ReadAll(resp.Body)
	_ = resp.Body.Close()
	if err != nil {
		return nil, err
	}

	body := wrapBody(mt, resp.StatusCode, raw)
	resp.StatusCode = http.StatusOK
	resp.Body = io.NopCloser(bytes.NewReader(body))
	resp.ContentLength = int64(len(body))
	resp.Header.Set("Content-Type", "application/json; charset=utf-8")
	resp.Header.Set("Content-Length", strconv.Itoa(len(body)))
	resp.Header.Del("Content-Encoding")

	return resp, nil
}

func wrapBody(mt string, status int, raw []byte) []byte {
	out := map[string]interface{}{
		"code":    status,
		"content": nil,
		"message": "success",
	}

	ok := status == http.StatusOK

	if mt == "text/plain" {
		text := string(raw)
		if ok {
			out["content"] = text
		} else {
			out["message"] = text
		}
	} else {
		var v interface{}
		if err := json.Unmarshal(raw, &v); err != nil {
			v = string(raw)
		}
		if ok {
			out["content"] = v
		} else {
			out["message"] = v
		}
	}

	b, _ := json.Marshal(out)
	return b
}

func writeJSON(w http.ResponseWriter, code int, msg string) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"code":    code,
		"message": msg,
		"content": nil,
	})
}
