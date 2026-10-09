package db

import (
	"asset/internal/model"
	"common/databases"

	"gorm.io/gorm"
)

func InitPostgresSQL(dsn string) (*gorm.DB, error) {
	db, err := databases.InitPostgresSQL(dsn)
	if err != nil {
		return nil, err
	}

	if err := db.AutoMigrate(&model.Resource{}); err != nil {
		return nil, err
	}

	return db, nil
}
