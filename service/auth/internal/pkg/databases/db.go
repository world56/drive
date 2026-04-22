package databases

import (
	"auth/internal/model"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func InitPostgresSQL(dsn string) (*gorm.DB, error) {
	db, err := gorm.Open(
		postgres.Open(dsn), &gorm.Config{},
	)
	if err != nil {
		return nil, err
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, err
	}

	sqlDB.SetMaxOpenConns(100)

	if err := db.AutoMigrate(&model.User{}, &model.Log{}); err != nil {
		return nil, err
	}

	return db, nil
}
