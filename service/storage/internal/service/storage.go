package service

import (
	"context"
	"mime/multipart"
	"storage/internal/config"
	"storage/internal/dto"

	"github.com/redis/go-redis/v9"

	minioSDK "github.com/minio/minio-go/v7"
)

type StorageService struct {
	config config.Config
	redis  *redis.Client
	minio  *minioSDK.Core
}

func newStorageService(config config.Config, redis *redis.Client, minio *minioSDK.Core) *StorageService {
	return &StorageService{
		config: config,
		redis:  redis,
		minio:  minio,
	}
}

func (s *StorageService) Write(c context.Context, stream multipart.File, info dto.File) error {
	IS_FIRST_CHUNK := info.Index == 0 // 第一个chunk

	if IS_FIRST_CHUNK {
		ID, err := s.minio.NewMultipartUpload(c, s.config.MINIO_BUCKET, info.Name, minioSDK.PutObjectOptions{})
		if err != nil {
			return err
		}
		info.MinioID = ID
	} else {
		ID, err := s.redis.HGet(c, `drive:write:`+info.ID, "MinioID").Result()
		if err != nil {
			return err
		}
		info.MinioID = ID
	}

	_, err := s.minio.PutObjectPart(c, s.config.MINIO_BUCKET, info.Name, info.MinioID, info.Index, stream, info.Size, minioSDK.PutObjectPartOptions{})
	// part.ETag
	if err != nil {
		if IS_FIRST_CHUNK {
			s.minio.AbortMultipartUpload(c, s.config.MINIO_BUCKET, info.Name, info.MinioID)
			s.redis.HDel(c, `drive:write:`+info.ID)
		}
		return err
	}

	_, rErr := s.redis.HSet(c, `drive:write:`+info.ID, info.MinioID).Result()
	if rErr != nil {
		return rErr
	}

	// if info.Index == info.Total {
	// 	_, err := s.minio.CompleteMultipartUpload(c, s.config.MINIO_BUCKET, info.Name, info.MinioID, minioSDK.PutObjectOptions{})
	// 	if err != nil {
	// 		return err
	// 	}
	// 	s.redis.HDel(c, `drive:write:`+info.ID)
	// }

	return nil
}
