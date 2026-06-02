package dto

type ResponseStorageUsage struct {
	Free    uint64         `json:"free"`
	Total   uint64         `json:"total"`
	Used    uint64         `json:"used"`
	Storage StorageDetails `json:"storage"`
}

type ResponseHotItem struct {
	Name  string  `json:"name"`
	Value float64 `json:"value"`
}

type RequestHotLabel struct {
	Name string `json:"name" binding:"required,min=1"`
}

type StorageDetails struct{}

type AccessTrendsItem struct {
	Date  string `json:"date"`
	Value int64  `json:"value"`
}
