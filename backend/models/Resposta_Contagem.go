package models

import "gorm.io/gorm"

// Contagem representa uma sessão de contagem de estoque
type Contagem struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	Descricao   string         `json:"descricao"`
	Data        string         `json:"data"`
	Status      string         `json:"status"`
	Responsavel string         `json:"responsavel"`
	Itens       []ItemContagem `gorm:"foreignKey:ContagemID" json:"itens"`
	CreatedAt   int64          `json:"created_at"`
	UpdatedAt   int64          `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}
