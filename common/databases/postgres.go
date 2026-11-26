package databases

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func InitPostgresSQL(dsn string, models ...any) (*gorm.DB, error) {
	db, err := gorm.Open(
		postgres.Open(dsn),
		&gorm.Config{DisableForeignKeyConstraintWhenMigrating: true},
	)
	if err != nil {
		return nil, err
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, err
	}

	sqlDB.SetMaxOpenConns(100)
	if len(models) == 0 {
		return db, nil
	}
	if err := db.AutoMigrate(models...); err != nil {
		return nil, err
	}
	return db, nil
}

func Close(db *gorm.DB) error {
	if db == nil {
		return nil
	}

	sqlDB, err := db.DB()
	if err != nil {
		return err
	}

	return sqlDB.Close()
}
