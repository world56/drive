package jsontypes

import (
	"encoding/json"
	"strconv"
)

// 定义类型（而不是函数）
type StringInt64Slice []int64

// 实现 json.Unmarshaler 接口
func (s *StringInt64Slice) UnmarshalJSON(data []byte) error {
	var strSlice []string
	if err := json.Unmarshal(data, &strSlice); err != nil {
		return err
	}

	res := make([]int64, len(strSlice))
	for i, str := range strSlice {
		val, err := strconv.ParseInt(str, 10, 64)
		if err != nil {
			return err
		}
		res[i] = val
	}
	*s = res
	return nil
}
