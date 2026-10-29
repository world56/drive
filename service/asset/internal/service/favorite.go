package service

import (
	assetpb "api/asset"
	"asset/internal/dto"
	"asset/internal/enum"
	"asset/internal/model"
	"common/utils/jsontypes"
	"context"

	"gorm.io/gorm"
)

type FavoriteService struct {
	db *gorm.DB
}

func newFavoriteService(db *gorm.DB) *FavoriteService {
	return &FavoriteService{
		db: db,
	}
}

func (s *FavoriteService) GetFavorites(c context.Context, userID string, query dto.RequestFavorites) ([]dto.Favorite, error) {
	order := enum.SortDesc
	if query.CreateTime != "" {
		order = string(query.CreateTime)
	}
	db := s.db.WithContext(c).
		Table("favorites AS f").
		Select("f.*, r.full_name, r.type, r.size, r.suffix, r.object_name, r.remove, r.parent_id").
		Order("f.create_time "+order).
		Where("f.user_id = ?", userID).
		Joins("INNER JOIN resources AS r ON r.id = f.resource_id")

	if query.FullName != "" {
		db = db.Where("r.full_name LIKE ?", "%"+query.FullName+"%")
	}
	if len(query.Type) > 0 {
		db = db.Where("r.type IN ?", query.Type)
	}

	var list []dto.Favorite
	err := db.Scan(&list).Error
	return list, err
}

func (s *FavoriteService) InsertFavorite(c context.Context, userID string, resourceIDs jsontypes.StringInt64Slice) error {
	favorites := make([]model.Favorite, 0, len(resourceIDs))
	for _, id := range resourceIDs {
		favorites = append(favorites, model.Favorite{
			UserID:     userID,
			ResourceID: id,
		})
	}
	return s.db.WithContext(c).Create(&favorites).Error
}

func (s *FavoriteService) RemoveFavorite(c context.Context, userID string, resourceIDs jsontypes.StringInt64Slice) error {
	return s.db.WithContext(c).Where("resource_id IN ? AND user_id = ?", resourceIDs, userID).Delete(&model.Favorite{}).Error
}

func (s *FavoriteService) GetFavorite(c context.Context) ([]*assetpb.Resource, error) {
	db := s.db.WithContext(c)
	var resources []*assetpb.Resource

	ranking := db.Table("favorites").
		Select("resource_id, COUNT(*) AS count").
		Group("resource_id").
		Order("count DESC").
		Limit(10)

	if err := db.Table("resources AS r").
		Select("r.full_name, r.type, r.parent_id").
		Joins("INNER JOIN (?) AS f ON f.resource_id = r.id", ranking).
		Where("r.remove = ?", enum.ResourceNormal).
		Order("f.count DESC").
		Scan(&resources).Error; err != nil {
		return nil, err
	} else {
		return resources, nil
	}
}
