package dto

type ResponseStorageUsage struct {
	Free    uint64               `json:"free"`
	Total   uint64               `json:"total"`
	Used    uint64               `json:"used"`
	Storage *StorageCountDetails `json:"storage"`
}

type ResponseHotItem struct {
	Name  string  `json:"name"`
	Value float64 `json:"value"`
}

type RequestHotLabel struct {
	Name string `json:"name" binding:"required,min=1"`
}

type StorageCountDetails map[string]int64

type AccessTrendsItem struct {
	Date  string `json:"date"`
	Value int64  `json:"value"`
}

type ResponseResourceSort struct {
	ID       string `json:"id"`
	FullName string `json:"fullName"`
	ParentID *int64 `json:"parentId,string,omitempty"`
	Type     int32  `json:"type"`
}
