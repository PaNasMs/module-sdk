package userfiles

import (
	"os"
	"path/filepath"
	"testing"
)

func TestSystemUmask(t *testing.T) {
	for _, tc := range []struct {
		input string
		want  int
		bad   bool
	}{
		{"# UMASK 077\n", 0022, false}, {"UMASK 002\n", 0002, false},
		{"UMASK 027 # private group\n", 0027, false}, {"UMASK 077\n", 0077, false},
		{"UMASK 089\n", 0, true}, {"UMASK\n", 0, true}, {"UMASK 1777\n", 0, true},
	} {
		t.Run(tc.input, func(t *testing.T) {
			path := filepath.Join(t.TempDir(), "login.defs")
			if err := os.WriteFile(path, []byte(tc.input), 0600); err != nil {
				t.Fatal(err)
			}
			got, err := readUmask(path)
			if (err != nil) != tc.bad || !tc.bad && got != tc.want {
				t.Fatalf("got %o, %v", got, err)
			}
		})
	}
	got, err := readUmask(filepath.Join(t.TempDir(), "missing"))
	if err != nil || got != 0022 {
		t.Fatalf("missing: %o, %v", got, err)
	}
}
