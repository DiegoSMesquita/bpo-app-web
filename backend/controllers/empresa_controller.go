package controllers

import (
	"net/http"

	"github.com/DiegoSMesquita/bpo-app-web-main/config"
	"github.com/DiegoSMesquita/bpo-app-web-main/models"
	"github.com/gin-gonic/gin"
)

// CriarEmpresa adiciona uma nova empresa no banco de dados
func CriarEmpresa(c *gin.Context) {
	var novaEmpresa models.Empresa

	// Faz o bind dos dados recebidos do JSON para a struct
	if err := c.ShouldBindJSON(&novaEmpresa); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "Dados inválidos", "detalhes": err.Error()})
		return
	}

	// Inserir no banco
	if err := config.DB.Create(&novaEmpresa).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao criar empresa", "detalhes": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, novaEmpresa)
}

// ListarEmpresas retorna todas as empresas cadastradas
func ListarEmpresas(c *gin.Context) {
	var empresas []models.Empresa

	if err := config.DB.Find(&empresas).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao buscar empresas", "detalhes": err.Error()})
		return
	}

	c.JSON(http.StatusOK, empresas)
}
