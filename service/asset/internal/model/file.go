package model

import "github.com/google/uuid"

type File struct {
	ID   uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid();" json:"id"`
	Name string    `gorm:"type:varchat(256)"`
}
