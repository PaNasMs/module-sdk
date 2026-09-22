package external

import (
	"context"
	"errors"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"
)

type transport func(*http.Request) (*http.Response, error)

func (f transport) RoundTrip(r *http.Request) (*http.Response, error) { return f(r) }
func TestTokenContract(t *testing.T) {
	for _, status := range []int{200, 403, 409, 503} {
		t.Run(http.StatusText(status), func(t *testing.T) {
			c := &Client{http: &http.Client{Transport: transport(func(r *http.Request) (*http.Response, error) {
				raw, _ := io.ReadAll(r.Body)
				if r.Method != "POST" || r.URL.Path != "/v1/token" || !strings.Contains(string(raw), `"owner":"alice"`) || !strings.Contains(string(raw), `"grantId":"grant"`) {
					t.Fatal("wrong request")
				}
				w := httptest.NewRecorder()
				w.WriteHeader(status)
				if status == 200 {
					w.WriteString(`{"accessToken":"test-only","tokenType":"Bearer","expiresAt":"` + time.Now().Add(time.Hour).UTC().Format(time.RFC3339) + `","scope":"drive"}`)
				} else {
					w.WriteString(`{"error":"external.reconnectRequired"}`)
				}
				return w.Result(), nil
			})}}
			access, err := c.Token(context.Background(), "grant", "alice")
			if status == 200 {
				if err != nil || access.AccessToken != "test-only" {
					t.Fatal(err)
				}
			} else {
				var e *Error
				if !errors.As(err, &e) || e.Status != status {
					t.Fatal("lost status", err)
				}
			}
		})
	}
}
