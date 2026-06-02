package service

import (
	"context"
	"stats/internal/dto"
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

func (s *StatsService) FindAccessTrends(c context.Context) ([]dto.AccessTrendsItem, error) {
	now := time.Now()
	trends := make([]dto.AccessTrendsItem, 14)

	pipe := s.redis.Pipeline()
	cmds := make([]*redis.IntCmd, 14)
	for i := range 14 {
		date := now.AddDate(0, 0, -i).Format("01-02")
		trends[i] = dto.AccessTrendsItem{Date: date}
		cmds[i] = pipe.SCard(c, "drive:use:"+date)
	}

	if _, err := pipe.Exec(c); err != nil {
		return nil, err
	}
	for i, cmd := range cmds {
		if value, err := cmd.Result(); err == nil {
			trends[i].Value = value
		}
	}

	return trends, nil
}

func (s *StatsService) FindHot(c context.Context) ([]*dto.ResponseHotItem, error) {
	data, err := s.redis.ZRevRangeWithScores(c, "drive:hot", 0, 9).Result()
	if err != nil {
		return nil, err
	}

	length := len(data)
	hots := make([]*dto.ResponseHotItem, 0, length)
	for _, z := range data {
		hots = append(hots, &dto.ResponseHotItem{
			Value: z.Score,
			Name:  z.Member.(string),
		})
	}

	return hots, nil
}

func (s *StatsService) UpdateHot(c context.Context, query dto.RequestHotLabel) error {
	return s.redis.ZIncrBy(c, "drive:hot", 1, query.Name).Err()
}
