package service

import (
	assetpb "api/asset"
	"asset/internal/dto"
	"asset/internal/enum"
	"asset/internal/model"
	"asset/internal/pkg/filetype"
	grpcclient "asset/internal/transport/grpc/client"
	"common/databases"
	"context"
	"errors"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

type ResourceService struct {
	db         *gorm.DB
	redis      *redis.Client
	grpcClient *grpcclient.GrpcClient
}

func newResourceService(db *gorm.DB, redis *redis.Client, grpcClient *grpcclient.GrpcClient) *ResourceService {
	return &ResourceService{
		db:         db,
		redis:      redis,
		grpcClient: grpcClient,
	}
}

func (s *ResourceService) SearchResourcesByName(c context.Context, query dto.RequestSearchResourcesByName) ([]dto.ReposesResource, error) {
	db := s.db.WithContext(c).
		Model(&model.Resource{}).
		Select("id", "type", "suffix", "parent_id", "full_name", "create_time", "object_name").
		Where("remove = ?", 0).
		Where("name LIKE ?", "%"+query.Name+"%")

	if len(query.Type) > 0 {
		db = db.Where("type IN ?", query.Type)
	}
	if query.StartTime != nil && query.EndTime != nil {
		endTime := time.Unix(*query.EndTime, 0)
		startTime := time.Unix(*query.StartTime, 0)
		db = db.Where("create_time >= ? AND create_time <= ?", startTime, endTime)
	}
	if query.Sort != nil {
		db = db.Order("create_time " + *query.Sort)
	} else {
		db = db.Order("create_time " + enum.SortDesc)
	}

	var files []dto.ReposesResource
	if err := db.Find(&files).Error; err != nil {
		return nil, err
	}

	return files, nil
}

func (s *ResourceService) GetResources(c context.Context, userID string, query dto.RequestFiles) ([]dto.ReposesResource, error) {
	db := s.db.WithContext(c).Order("create_time " + query.Order)

	if query.ID == nil {
		db = db.Where("r.parent_id IS NULL")
	} else {
		db = db.Where("r.parent_id = ?", *query.ID)
	}

	var files []dto.ReposesResource
	if err := db.Table("resources AS r").
		Select(`r.*,
			CASE 
				WHEN r.type = 0 THEN COUNT(f.id)
				ELSE NULL
			END AS count,
			CASE
				WHEN COUNT(l.user_id) > 0 THEN 1
				ELSE 0
			END AS favorite
		`).
		Where("r.remove = ?", enum.ResourceNormal).
		Joins("LEFT JOIN resources AS f ON f.parent_id = r.id AND f.remove = ?", enum.ResourceNormal).
		Joins("LEFT JOIN favorites AS l ON l.user_id = ? AND l.resource_id = r.id", userID).
		Group("r.id").
		Scan(&files).Error; err != nil {
		return nil, err
	}

	return files, nil
}

func (s *ResourceService) GetResourceFolders(c context.Context) ([]dto.Resource, error) {
	var folders []dto.Resource
	if err := s.db.WithContext(c).
		Model(&model.Resource{}).
		Where("remove = ?", enum.ResourceNormal).
		Where("type = ?", enum.ResourceTypeFolder).
		Find(&folders).Error; err != nil {
		return nil, err
	}

	return folders, nil
}

func (s *ResourceService) GetResourceDetail(c context.Context, query dto.RequestResourceDetail) (*dto.Resource, error) {
	var resource *dto.Resource
	if err := s.db.WithContext(c).
		Table("resources AS r").
		Select(`
        r.*,
        CASE 
            WHEN r.type = 0 THEN COUNT(f.id)
            ELSE NULL
        END AS count
    `).
		Joins("LEFT JOIN resources AS f ON f.parent_id = r.id AND f.remove = ?", enum.ResourceNormal).
		Where("r.id = ? AND r.remove = ?", query.ID, enum.ResourceNormal).
		Group("r.id").
		Scan(&resource).Error; err != nil {
		return nil, err
	}

	return resource, nil
}

func (s *ResourceService) InsertResource(c context.Context, creatorID string, fullName, objectName string, parentID *int64, size int64, path string) bool {
	ext := filepath.Ext(fullName)
	suffix := strings.TrimPrefix(ext, ".")
	baseName := strings.TrimSuffix(fullName, ext)
	pID := parentID

	if path != "" {
		folderID, err := s.createFolders(c, parentID, path, creatorID)
		if err == nil {
			pID = folderID
		}
	}

	for n := 1; n <= 64; n++ {
		name := baseName
		if n > 1 {
			name = baseName + " " + strconv.Itoa(n)
		}
		resourceType := filetype.DetectBySuffix(suffix)
		err := s.db.WithContext(c).Create(&model.Resource{
			Size:       size,
			Suffix:     &suffix,
			Name:       name,
			FullName:   name + ext,
			ParentID:   pID,
			CreatorID:  creatorID,
			ObjectName: objectName,
			Type:       resourceType,
		}).Error
		if err == nil {
			s.grpcClient.Stats.UpdateAssetCount("ADD", map[int8]int32{resourceType: 1})
			return true
		}
		if !databases.IsUniqueViolation(err) {
			return false
		}
	}
	return false
}

func (s *ResourceService) DeleteResources(c context.Context, body dto.RequestDeleteFiles) error {
	var resources []model.Resource
	if err := s.db.WithContext(c).
		Model(&model.Resource{}).
		Select("type").
		Where("id IN ?", body.IDs).
		Where("remove = ?", enum.ResourceNormal).
		Find(&resources).Error; err != nil {
		return err
	}

	if err := s.db.WithContext(c).
		Model(&model.Resource{}).
		Where("id IN ?", body.IDs).
		Update("remove", enum.ResourceRecycled).Error; err != nil {
		return err
	}

	counts := make(map[int8]int32)
	for _, resource := range resources {
		counts[resource.Type]++
	}
	if len(counts) > 0 {
		s.grpcClient.Stats.UpdateAssetCount("REDUCE", counts)
	}
	return nil
}

func (s *ResourceService) UpdateResourceInfo(c context.Context, body dto.RequestResourceUpdateInfo) error {
	db := s.db.WithContext(c)

	var target model.Resource
	if err := db.Where("id = ?", body.ID).First(&target).Error; err != nil {
		return err
	}

	fullName := body.Name
	if target.Type != enum.ResourceTypeFolder && target.Suffix != nil && *target.Suffix != "" {
		fullName = body.Name + "." + *target.Suffix
	}

	update := map[string]interface{}{
		"full_name": fullName,
		"name":      body.Name,
		"remark":    body.Remark,
		"parent_id": body.ParentID,
	}

	if err := db.Model(&model.Resource{}).
		Where("id = ?", body.ID).
		Updates(update).
		Error; err != nil {
		return err
	}

	return nil
}

func (s *ResourceService) MkdirFolder(c context.Context, creatorID string, data dto.RequestMkdirFolder) (bool, error) {
	db := s.db.WithContext(c)

	var folder model.Resource
	err := db.Where("name = ?", data.Name).Where("parent_id IS NOT DISTINCT FROM ?", data.ParentID).First(&folder).Error

	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return false, err
	} else if err == nil {
		return false, errors.New("folder already exists")
	} else {
		if err := db.Create(&model.Resource{
			Name:      data.Name,
			FullName:  data.Name,
			CreatorID: creatorID,
			Remark:    data.Remark,
			ParentID:  data.ParentID,
			Type:      enum.ResourceTypeFolder,
		}).Error; err != nil {
			return false, err
		} else {
			return true, nil
		}
	}
}

func (s *ResourceService) UpdateResourcesLocation(c context.Context, body dto.RequestResourceUpdateLocation) (bool, error) {
	var items []model.Resource
	err := s.db.WithContext(c).Transaction(func(t *gorm.DB) error {
		if err := t.Where("id IN ?", body.IDs).Find(&items).Error; err != nil {
			return err
		}

		for _, item := range items {
			for i := 1; i <= 64; i++ {
				name := item.Name
				if i > 1 {
					name = name + " " + strconv.Itoa(i)
				}
				fullName := name
				if item.Type != enum.ResourceTypeFolder && item.Suffix != nil && *item.Suffix != "" {
					fullName = name + "." + *item.Suffix
				}

				eventID := "sp_" + strconv.FormatInt(item.ID, 10) + "_" + strconv.Itoa(i)
				if err := t.SavePoint(eventID).Error; err != nil {
					return err
				}

				err := t.Model(&model.Resource{}).
					Where("id = ?", item.ID).
					Updates(map[string]interface{}{
						"name":      name,
						"full_name": fullName,
						"parent_id": body.ParentID,
					}).Error

				if err == nil {
					break
				}
				if !databases.IsUniqueViolation(err) {
					return err
				}

				if err := t.RollbackTo(eventID).Error; err != nil {
					return err
				}
			}
		}
		return nil
	})

	if err == nil {
		return true, nil
	} else {
		return false, err
	}
}

func (s *ResourceService) GetRecently(c context.Context) ([]*assetpb.Resource, error) {
	var resources []*assetpb.Resource

	if err := s.db.WithContext(c).
		Model(&model.Resource{}).
		Select("id, full_name, type, parent_id").
		Where("remove = ?", enum.ResourceNormal).
		Limit(10).
		Order("create_time DESC").
		Find(&resources).Error; err != nil {
		return nil, err
	}
	return resources, nil
}

func (s *ResourceService) GetResourceTypeCount(c context.Context) ([]dto.ResourceCountType, error) {
	var data []dto.ResourceCountType
	if err := s.db.WithContext(c).
		Model(&model.Resource{}).
		Select("type, COUNT(*) AS count").
		Where("remove = ?", enum.ResourceNormal).
		Group("type").Find(&data).Error; err != nil {
		return nil, err
	} else {
		return data, nil
	}
}

// 批量上传创建文件夹
func (s *ResourceService) createFolders(c context.Context, parentID *int64, path string, creatorID string) (*int64, error) {
	dir := filepath.Dir(path)
	paths := strings.Split(dir, "/")

	parentKey := "root"
	if parentID != nil {
		parentKey = strconv.FormatInt(*parentID, 10)
	}

	cacheKey := "drive:folder:" + parentKey
	if val, err := s.redis.HGet(c, cacheKey, dir).Result(); err == nil {
		id, err := strconv.ParseInt(val, 10, 64)
		if err == nil {
			return &id, nil
		}
	}

	cur := parentID
	var last *int64
	for _, name := range paths {
		id, err := s.createFolder(c, cur, name, creatorID)
		if err != nil {
			return nil, err
		}
		last = &id
		cur = &id
	}
	if last != nil {
		if err := s.redis.HSet(c, cacheKey, dir, strconv.FormatInt(*last, 10)).Err(); err == nil {
			_ = s.redis.Expire(c, cacheKey, 3*time.Minute).Err()
		}
	}
	return last, nil
}

func (s *ResourceService) createFolder(c context.Context, parentId *int64, name, creatorID string) (int64, error) {
	db := s.db.WithContext(c)

	folder := model.Resource{
		Name:      name,
		FullName:  name,
		ParentID:  parentId,
		CreatorID: creatorID,
		Type:      enum.ResourceTypeFolder,
	}

	err := db.Create(&folder).Error
	if err == nil {
		return folder.ID, nil
	}
	if !databases.IsUniqueViolation(err) {
		return 0, err
	}

	var exist model.Resource
	if err := db.Where("name = ?", name).
		Where("parent_id IS NOT DISTINCT FROM ?", parentId).
		Where("type = ?", enum.ResourceTypeFolder).
		Where("remove = ?", enum.ResourceNormal).
		First(&exist).Error; err != nil {
		return 0, err
	}
	return exist.ID, nil
}
