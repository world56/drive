package service

import (
	"context"
	"stats/internal/dto"
	"strconv"
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

	// s.redis.HGetAll("drive:storage") // 各种类型资源数量
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

func (s *StatsService) UpdateAccess(c context.Context, userId string) error {
	key := "drive:use:" + time.Now().Format("01-02")
	if _, err := s.redis.SAdd(c, key, userId).Result(); err != nil {
		return err
	}

	now := time.Now()
	end := time.Date(now.Year(), now.Month(), now.Day()+14, 0, 0, 0, 0, now.Location())
	if err := s.redis.Expire(c, key, time.Until(end)).Err(); err != nil {
		return err
	}

	return nil
}

func (s *StatsService) UpdateCount(c context.Context, resourceType int32, resourceCount int32) error {
	key := strconv.FormatInt(int64(resourceType), 10)

	count, err := s.redis.HGet(c, `drive:storage`, key).Result()
	if err == redis.Nil {
		count = "0"
	} else if err != nil {
		return err
	}

	total, err := strconv.ParseInt(count, 10, 32)
	if err != nil {
		return err
	}

	_, err = s.redis.HSet(c, `drive:storage`, key, int32(total)+resourceCount).Result()
	if err != nil {
		return err
	}

	return nil
}
