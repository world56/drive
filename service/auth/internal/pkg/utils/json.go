package utils

import "encoding/json"

// 转换为json字符串，失败则返回空字符串
func ToDescString(value any) string {
	if value == nil {
		return ""
	}

	if s, ok := value.(string); ok {
		return s
	}

	j, err := json.Marshal(value)
	if err != nil || string(j) == "null" {
		return ""
	}

	return string(j)
}
