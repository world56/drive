package databases

import (
	"auth/internal/model"
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func InitPostgresSQL() (*gorm.DB, error) {
	dsn := "host=localhost user=postgres password=Abc123456 dbname=drive port=5432 sslmode=disable TimeZone=Asia/Shanghai"
	db, err := gorm.Open(
		postgres.Open(dsn), &gorm.Config{},
	)
	if err != nil {
		return nil, fmt.Errorf("error-pg-connect: %w", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("error-pg-init: %w", err)
	}

	sqlDB.SetMaxOpenConns(100)

	if err := db.AutoMigrate(&model.User{}); err != nil {
		return nil, fmt.Errorf("error-pg-model-init: %w", err)
	}

	return db, nil
}
