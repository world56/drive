package db

import (
	"auth/internal/model"

	"common/databases"

	"gorm.io/gorm"
)

func InitPostgresSQL(dsn string) (*gorm.DB, error) {
	db, err := databases.InitPostgresSQL(dsn)
	if err != nil {
		return nil, err
	}

	if err := db.AutoMigrate(&model.User{}, &model.Log{}); err != nil {
		return nil, err
	}

	return db, nil
}
