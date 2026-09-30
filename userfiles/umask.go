package userfiles

import (
	"errors"
	"fmt"
	"os"
	"strconv"
	"strings"
)

// DefaultUmask reads the system policy for user-created data. It does not change
// the server's process-wide mask; callers apply it only in a dedicated child.
func DefaultUmask() (int, error) {
	return readUmask("/etc/login.defs")
}

func readUmask(path string) (int, error) {
	data, err := os.ReadFile(path)
	if errors.Is(err, os.ErrNotExist) {
		return 0022, nil
	}
	if err != nil {
		return 0, err
	}
	mask := 0022
	for _, line := range strings.Split(string(data), "\n") {
		fields := strings.Fields(strings.SplitN(line, "#", 2)[0])
		if len(fields) == 0 || fields[0] != "UMASK" {
			continue
		}
		if len(fields) != 2 {
			return 0, fmt.Errorf("invalid UMASK in login.defs")
		}
		if strings.Trim(fields[1], "01234567") != "" {
			return 0, fmt.Errorf("invalid UMASK in login.defs")
		}
		value, err := strconv.ParseUint(fields[1], 8, 9)
		if err != nil {
			return 0, fmt.Errorf("invalid UMASK in login.defs")
		}
		mask = int(value)
	}
	return mask, nil
}
