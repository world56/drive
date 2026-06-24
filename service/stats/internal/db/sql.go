package db

import (
	"common/databases"

	"gorm.io/gorm"
)

func InitPostgresSQL(dsn string) (*gorm.DB, error) {
	db, err := databases.InitPostgresSQL(dsn)
	if err != nil {
		return nil, err
	}

	return db, nil
}
