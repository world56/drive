package service

import (
	"context"
	"encoding/json"
	"errors"
	"stats/internal/dto"
	grpcclient "stats/internal/transport/grpc/client"
	"strconv"
	"time"

	"github.com/redis/go-redis/v9"
)

type StatsService struct {
	redis      *redis.Client
	grpcClient *grpcclient.GrpcClient
}

func newStatsService(r *redis.Client, grpcClient *grpcclient.GrpcClient) *StatsService {
	return &StatsService{
		redis:      r,
		grpcClient: grpcClient,
	}
}

func (s *StatsService) FindStorage(c context.Context) (*dto.ResponseStorageUsage, error) {
	use, err := s.grpcClient.Storage.GetSpaceUsage()
	if err != nil {
		return nil, err
	}

	data, err := s.redis.HGetAll(c, "drive:storage").Result()
	if err != nil {
		return nil, err
	}

	if len(data) == 0 {
		count, err := s.grpcClient.Asset.GetCount(c, nil)
		if err != nil {
			return nil, err
		}

		if len(*count) > 0 {
			fields := make(map[string]interface{}, len(*count))
			for k, v := range *count {
				fields[k] = v
			}
			if err := s.redis.HSet(c, "drive:storage", fields).Err(); err != nil {
				return nil, err
			}
		}
		use.Storage = count
		return use, nil
	}
	storage := make(dto.StorageCountDetails, len(data))
	for key, value := range data {
		n, err := strconv.ParseInt(value, 10, 64)
		if err != nil {
			return nil, err
		}
		storage[key] = n
	}
	use.Storage = &storage
	return use, nil
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

func (s *StatsService) GetRecently(c context.Context) ([]dto.ResponseResourceSort, error) {
	var recently []dto.ResponseResourceSort
	list, err := s.redis.Get(c, "drive:recently").Bytes()
	if err == nil {
		if json.Unmarshal(list, &recently) == nil {
			return recently, nil
		}
	}

	if len(recently) > 0 {
		return recently, nil
	}

	data, err := s.grpcClient.Asset.GetRecently(c, nil)
	if err != nil {
		return nil, err
	}

	j, err := json.Marshal(data)
	if err != nil {
		return nil, err
	}

	if err := s.redis.Set(c, "drive:recently", j, time.Minute).Err(); err != nil {
		return nil, err
	} else {
		return data, nil
	}
}

func (s *StatsService) GetFavorite(c context.Context) ([]dto.ResponseResourceSort, error) {
	var favorite []dto.ResponseResourceSort
	list, err := s.redis.Get(c, "drive:favorite").Bytes()
	if err == nil {
		if json.Unmarshal(list, &favorite) == nil {
			return favorite, nil
		}
	}

	if len(favorite) > 0 {
		return favorite, nil
	}

	data, err := s.grpcClient.Asset.GetFavorite(c, nil)
	if err != nil {
		return nil, err
	}

	j, err := json.Marshal(data)
	if err != nil {
		return nil, err
	}

	if err := s.redis.Set(c, "drive:favorite", j, time.Minute).Err(); err != nil {
		return nil, err
	} else {
		return data, nil
	}
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

func (s *StatsService) UpdateCount(c context.Context, calculation string, counts map[int32]int32) error {
	var sign int32
	switch calculation {
	case "ADD":
		sign = 1
	case "REDUCE":
		sign = -1
	default:
		return errors.New("invalid calculation")
	}

	for resourceType, resourceCount := range counts {
		if resourceCount <= 0 {
			continue
		}

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

		next := int32(total) + sign*resourceCount
		if next < 0 {
			next = 0
		}

		if _, err = s.redis.HSet(c, `drive:storage`, key, next).Result(); err != nil {
			return err
		}
	}

	return nil
}
