package external

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net"
	"net/http"
	"time"
)

const Socket = "/run/panasms-core/grants.sock"

type Access struct {
	AccessToken string    `json:"accessToken"`
	TokenType   string    `json:"tokenType"`
	ExpiresAt   time.Time `json:"expiresAt"`
	Scope       string    `json:"scope"`
}
type Error struct {
	Status int
	Code   string
}

func (e *Error) Error() string { return fmt.Sprintf("external permission: %s (%d)", e.Code, e.Status) }

type Client struct{ http *http.Client }

func New() *Client {
	return &Client{http: &http.Client{Timeout: 40 * time.Second, Transport: &http.Transport{DisableKeepAlives: true, DialContext: func(ctx context.Context, _, _ string) (net.Conn, error) {
		return (&net.Dialer{}).DialContext(ctx, "unix", Socket)
	}}}}
}

// Token is for the module's backend only. Never return its result to browser code or logs.
func (c *Client) Token(ctx context.Context, grantID, owner string) (Access, error) {
	body, _ := json.Marshal(map[string]string{"grantId": grantID, "owner": owner})
	req, err := http.NewRequestWithContext(ctx, "POST", "http://core/v1/token", bytes.NewReader(body))
	if err != nil {
		return Access{}, err
	}
	req.Header.Set("Content-Type", "application/json")
	res, err := c.http.Do(req)
	if err != nil {
		return Access{}, fmt.Errorf("external permission broker unavailable")
	}
	defer res.Body.Close()
	if res.StatusCode != 200 {
		var failure struct {
			Error string `json:"error"`
		}
		_ = json.NewDecoder(io.LimitReader(res.Body, 4096)).Decode(&failure)
		return Access{}, &Error{Status: res.StatusCode, Code: failure.Error}
	}
	var access Access
	if json.NewDecoder(io.LimitReader(res.Body, 32768)).Decode(&access) != nil || access.AccessToken == "" || access.TokenType != "Bearer" || !access.ExpiresAt.After(time.Now()) {
		return Access{}, fmt.Errorf("invalid external permission response")
	}
	return access, nil
}
