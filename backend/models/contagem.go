package models

import (
	"time"

	"gorm.io/gorm"
)

type Contagem struct {
	ID            uint           `gorm:"primaryKey" json:"id"`
	Descricao     string         `json:"descricao"`
	Data          time.Time      `json:"data"`
	Progresso     string         `json:"progresso"`
	TempoRestante string         `json:"tempo_restante"`
	Status        string         `json:"status"`
	Responsavel   string         `json:"responsavel"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
}
