package service

import (
	"context"
	"stats/internal/dto"
	"sync"
	"time"

	"github.com/redis/go-redis/v9"
	"github.com/shirou/gopsutil/v3/disk"
)

type StatsService struct {
	redis *redis.Client
}

func NewStatsService(r *redis.Client) *StatsService {
	return &StatsService{
		redis: r,
	}
}

func (s *StatsService) FindStorage(c context.Context) (*dto.ResponseStorageUsage, error) {
	use, err := disk.Usage("/")
	if err != nil {
		return nil, err
	}

	// s.redis.HGetAll("drive:storage")

	return &dto.ResponseStorageUsage{
		Free:  use.Free,
		Total: use.Total,
		Used:  use.Used,
	}, nil
}

func (s *StatsService) FindAccessTrends(c context.Context) {
	now := time.Now()
	var wg sync.WaitGroup
	ch := make(chan dto.AccessTrendsItem, 14)

	for i := range 14 {
		wg.Add(1)
		go func(index int) {
			defer wg.Done()
			date := now.AddDate(0, 0, -index).Format("01-02")
			value, err := s.redis.SCard(c, `drive:use:`+date).Result()
			if err != nil {
				return
			}
			ch <- dto.AccessTrendsItem{Date: date, Value: value}
		}(i)
	}

	go func() {
		wg.Wait()
		close(ch)
	}()

}
