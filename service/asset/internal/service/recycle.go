package service

import (
	storagepb "api/storage"
	"asset/internal/dto"
	"asset/internal/enum"
	"asset/internal/model"
	rabbitmq "common/rabbitmq"
	"common/utils/jsontypes"
	"context"

	amqp "github.com/rabbitmq/amqp091-go"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type RecycleService struct {
	db              *gorm.DB
	rabbitmq        *rabbitmq.Client
	resourceService *ResourceService
	favoriteService *FavoriteService
}

func newRecycleService(
	db *gorm.DB,
	rabbitmq *rabbitmq.Client,
	resourceService *ResourceService,
	favoriteService *FavoriteService,
) *RecycleService {
	return &RecycleService{
		db:              db,
		rabbitmq:        rabbitmq,
		favoriteService: favoriteService,
		resourceService: resourceService,
	}
}

func (s *RecycleService) GetRecycles(c context.Context) ([]dto.Recycle, error) {
	var recycles []dto.Recycle

	if err := s.db.WithContext(c).
		Table("recycles AS re").
		Select(`
				re.id,
				re.user_id,
				re.resource_id,
				u.name AS user_name,
				r.create_time,
				r.full_name,
				r.type,
				r.size,
				r.suffix,
				r.object_name,
				r.remove,
				r.parent_id,
				CASE 
					WHEN r.type = 0 THEN (
						SELECT COUNT(*)
						FROM resources AS res
						WHERE res.parent_id = r.id
					)
					ELSE NULL
				END AS count
		`).
		Joins("INNER JOIN resources AS r ON re.resource_id = r.id").
		Joins("LEFT JOIN users AS u ON re.user_id = u.id").
		Order("re.create_time DESC").
		Scan(&recycles).Error; err != nil {
		return nil, err
	}
	return recycles, nil
}

func (s *RecycleService) InsertResources(c context.Context, userID string, resourceIDs jsontypes.StringInt64Slice) error {
	return s.db.WithContext(c).Transaction(func(t *gorm.DB) error {
		resources := make([]model.Recycle, 0, len(resourceIDs))
		for _, id := range resourceIDs {
			resources = append(resources, model.Recycle{UserID: userID, ResourceID: id})
		}
		if err := t.Clauses(clause.OnConflict{DoNothing: true}).Create(&resources).Error; err != nil {
			return err
		}
		if err := s.resourceService.UpdateRemoveStatus(c, t, resourceIDs, enum.ResourceRecycled); err != nil {
			return err
		}
		return nil
	})

}

func (s *RecycleService) RestoreResources(c context.Context, userID string, resourceIDs jsontypes.StringInt64Slice) error {
	return s.db.WithContext(c).Transaction(func(t *gorm.DB) error {
		if err := t.Where("resource_id IN ? AND user_id = ?", resourceIDs, userID).Delete(&model.Recycle{}).Error; err != nil {
			return err
		}
		if err := s.resourceService.UpdateRemoveStatus(c, t, resourceIDs, enum.ResourceNormal); err != nil {
			return err
		}
		return nil
	})
}

func (s *RecycleService) RemoveRecycleBinResource(c context.Context, userID string, resourceIDs jsontypes.StringInt64Slice) error {
	var objectNames []string
	if err := s.db.WithContext(c).Transaction(func(t *gorm.DB) error {
		var resources []model.Resource
		if err := t.Raw(`
			WITH RECURSIVE tree AS (
				SELECT id, object_name, parent_id, type FROM resources WHERE id IN ?
				UNION ALL
				SELECT r.id, r.object_name, r.parent_id, r.type FROM resources AS r
				INNER JOIN tree AS p ON r.parent_id = p.id AND p.type = ?
			)
			SELECT id, type, object_name FROM tree
		`, resourceIDs, enum.ResourceTypeFolder).Scan(&resources).Error; err != nil {
			return err
		}

		resourcesIDs := make([]int64, 0, len(resources))
		for _, resource := range resources {
			resourcesIDs = append(resourcesIDs, resource.ID)
			if resource.ObjectName != "" && resource.Type != enum.ResourceTypeFolder {
				objectNames = append(objectNames, resource.ObjectName)
			}
		}
		if err := s.resourceService.DeleteResources(c, t, resourcesIDs); err != nil {
			return err
		}
		if err := t.Where("resource_id IN ?", resourcesIDs).Delete(&model.Recycle{}).Error; err != nil {
			return err
		}
		if err := s.favoriteService.RemoveFavorites(c, t, resourcesIDs); err != nil {
			return err
		}
		return nil
	}); err != nil {
		return err
	}

	if len(objectNames) == 0 {
		return nil
	}
	return s.rabbitmq.Publish(c, rabbitmq.PublishOptions{
		RoutingKey:  "remove",
		Exchange:    "resource",
		ContentType: "application/protobuf",
		Headers:     amqp.Table{"UserID": userID},
		Message:     &storagepb.ObjectNames{IDs: objectNames},
	})
}
