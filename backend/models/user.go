package models

import (
	"time"
)

type User struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	Name         string    `gorm:"size:255" json:"name"`
	Email        string    `gorm:"size:255;unique" json:"email"`
	PasswordHash string    `gorm:"size:255" json:"-"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}
