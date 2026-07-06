package service

import (
	"common/idgen"
	"context"
	"mime/multipart"
	"storage/internal/config"
	"storage/internal/dto"
	"strconv"

	"github.com/redis/go-redis/v9"

	"github.com/minio/minio-go/v7"
	minioSDK "github.com/minio/minio-go/v7"
)

type StorageService struct {
	config config.Config
	redis  *redis.Client
	minio  *minioSDK.Core
}

func newStorageService(config config.Config, redis *redis.Client, minio *minioSDK.Core) *StorageService {
	return &StorageService{
		redis:  redis,
		minio:  minio,
		config: config,
	}
}

func (s *StorageService) Write(c context.Context, stream multipart.File, size int64, info dto.File) (bool, error) {
	BUCKET := s.config.MINIO_BUCKET
	// 单个文件直接上传
	if info.Total == 1 {
		objectName := strconv.FormatInt(idgen.SnowflakeIDNext(), 10) + "_" + info.Name
		_, err := s.minio.Client.PutObject(c, BUCKET, objectName, stream, size, minio.PutObjectOptions{})
		if err != nil {
			return false, err
		} else {
			return true, nil
		}
	} else {
		IS_FIRST_CHUNK := info.Index == 1        // 第一个chunk
		IS_COMPLETED := info.Index == info.Total // 最后一个chunk

		// 初始化、拿到 minio ID
		if IS_FIRST_CHUNK {
			info.Name = strconv.FormatInt(idgen.SnowflakeIDNext(), 10) + "_" + info.Name
			ID, err := s.minio.NewMultipartUpload(c, BUCKET, info.Name, minioSDK.PutObjectOptions{})
			if err != nil {
				return false, err
			}
			info.MinioID = ID
		} else {
			var cache dto.File
			err := s.redis.HGetAll(c, `drive:write:`+info.ID).Scan(&cache)
			if err != nil {
				return false, err
			}
			info.Name = cache.Name
			info.MinioID = cache.MinioID
		}

		// 分段写入
		_, err := s.minio.PutObjectPart(c, BUCKET, info.Name, info.MinioID, info.Index, stream, size, minioSDK.PutObjectPartOptions{})
		if err != nil {
			if IS_FIRST_CHUNK {
				s.minio.AbortMultipartUpload(c, BUCKET, info.Name, info.MinioID)
				s.redis.Del(c, `drive:write:`+info.ID)
			}
			return false, err
		}

		_, rErr := s.redis.HSet(c, `drive:write:`+info.ID, info).Result()
		if rErr != nil {
			if IS_FIRST_CHUNK {
				s.minio.AbortMultipartUpload(c, BUCKET, info.Name, info.MinioID)
			}
			return false, rErr
		}

		// 全部完成
		if IS_COMPLETED {
			parts, err := s.minio.ListObjectParts(c, BUCKET, info.Name, info.MinioID, 0, info.Total)
			if err != nil {
				return false, err
			}

			var mergeParts []minio.CompletePart
			for _, v := range parts.ObjectParts {
				mergeParts = append(mergeParts, minio.CompletePart{PartNumber: v.PartNumber, ETag: v.ETag})
			}

			_, err = s.minio.CompleteMultipartUpload(c, BUCKET, info.Name, info.MinioID, mergeParts, minio.PutObjectOptions{})
			if err != nil {
				return false, err
			}

			s.redis.Del(c, `drive:write:`+info.ID)
			return true, nil
		}

		return false, nil
	}
}
