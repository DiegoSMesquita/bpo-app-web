package models

import "gorm.io/gorm"

type ItemContagem struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	ContagemID  uint           `json:"contagem_id"`
	Nome        string         `json:"nome"`
	QtdEsperada int            `json:"qtd_esperada"`
	CreatedAt   int64          `json:"created_at"`
	UpdatedAt   int64          `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}
