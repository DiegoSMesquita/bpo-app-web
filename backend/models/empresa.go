package models

import "time"

type Empresa struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Nome      string    `gorm:"not null" json:"nome"`
	Codigo    string    `gorm:"unique;not null" json:"codigo"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
