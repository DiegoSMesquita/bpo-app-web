// models/empresa.go
package models

import "gorm.io/gorm"

type Empresa struct {
	ID           uint           `json:"id" gorm:"primaryKey;autoIncrement"`
	Nome         string         `json:"nome"`
	CNPJ         string         `json:"cnpj"`
	Endereco     string         `json:"endereco"`
	CriadoEm     string         `json:"criado_em"`
	AtualizadoEm string         `json:"atualizado_em"`
	DeletadoEm   gorm.DeletedAt `json:"-" gorm:"index"`
}
