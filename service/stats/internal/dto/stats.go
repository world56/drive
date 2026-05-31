package dto

type ResponseStorageUsage struct {
	Free    uint64         `json:"free"`
	Total   uint64         `json:"total"`
	Used    uint64         `json:"used"`
	Storage StorageDetails `json:"storage"`
}

type StorageDetails struct{}

type AccessTrendsItem struct {
	Date  string `json:"date"`
	Value int64  `json:"value"`
}
