package utils

import (
	"strconv"
	"strings"
)

// ParseByteRange 解析 Range
func ParseByteRange(header string, size int64) (start, end int64, partial, ok bool) {
	if size <= 0 {
		return 0, 0, false, true
	}
	if header == "" {
		return 0, size - 1, false, true
	}
	if !strings.HasPrefix(header, "bytes=") {
		return 0, 0, false, false
	}
	spec := strings.TrimPrefix(header, "bytes=")
	if i := strings.IndexByte(spec, ','); i >= 0 {
		spec = spec[:i]
	}
	left, right, cut := strings.Cut(spec, "-")
	if !cut {
		return 0, 0, false, false
	}

	if left == "" { // bytes=-N
		n, err := strconv.ParseInt(right, 10, 64)
		if err != nil || n <= 0 {
			return 0, 0, false, false
		}
		if n > size {
			n = size
		}
		return size - n, size - 1, true, true
	}

	start, err := strconv.ParseInt(left, 10, 64)
	if err != nil || start < 0 || start >= size {
		return 0, 0, false, false
	}
	if right == "" { // bytes=N-
		return start, size - 1, true, true
	}
	end, err = strconv.ParseInt(right, 10, 64)
	if err != nil || end < start {
		return 0, 0, false, false
	}
	if end >= size {
		end = size - 1
	}
	return start, end, true, true
}
