package models

import (
	"time"

	"gorm.io/gorm"
)

// TokenContagem representa o link único de acesso da contagem
// usado para autenticar acesso via celular (sem login)
type TokenContagem struct {
	ID         uint           `gorm:"primaryKey" json:"id"`
	Token      string         `gorm:"unique" json:"token"`
	ContagemID uint           `json:"contagem_id"`
	ValidoAte  time.Time      `json:"valido_ate"`
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"updated_at"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"-"`
}
