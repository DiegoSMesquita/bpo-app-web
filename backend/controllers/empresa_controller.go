package controllers

import (
	"net/http"

	"github.com/DiegoSMesquita/bpo-app-web-main/config"
	"github.com/DiegoSMesquita/bpo-app-web-main/models"

	"github.com/gin-gonic/gin"
)

// POST /empresas
func CriarEmpresa(c *gin.Context) {
	var empresa models.Empresa
	if err := c.ShouldBindJSON(&empresa); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}

	if err := config.DB.Create(&empresa).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao criar empresa"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Empresa criada com sucesso"})
}

// GET /empresas
func ListarEmpresas(c *gin.Context) {
	var empresas []models.Empresa
	if err := config.DB.Find(&empresas).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao listar empresas"})
		return
	}

	c.JSON(http.StatusOK, empresas)
}
