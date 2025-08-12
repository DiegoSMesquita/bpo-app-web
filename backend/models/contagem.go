// models/contagem.go
package models

import (
	"time"

	"gorm.io/gorm"
)

type Contagem struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	Descricao     string    `json:"descricao"`
	Responsavel   string    `json:"responsavel"`
	Data          time.Time `json:"data"`
	TempoRestante int       `json:"tempoRestante"` // minutos
	Status        string    `json:"status"`        // aberta, finalizada, apagada
	Progresso     int       `json:"progresso"`     // %
	CreatedAt     time.Time
	UpdatedAt     time.Time
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`
}
