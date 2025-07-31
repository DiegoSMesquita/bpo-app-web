package controllers

import (
	"bpo-app-web-main/database"
	"bpo-app-web-main/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Criar nova empresa
func CriarEmpresa(c *gin.Context) {
	var empresa models.Empresa
	if err := c.ShouldBindJSON(&empresa); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}
	if err := database.DB.Create(&empresa).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": err.Error()})
		return
	}
	c.JSON(http.StatusOK, empresa)
}

// Listar todas as empresas
func ListarEmpresas(c *gin.Context) {
	var empresas []models.Empresa
	database.DB.Find(&empresas)
	c.JSON(http.StatusOK, empresas)
}

// Buscar empresa por ID
func BuscarEmpresa(c *gin.Context) {
	id := c.Param("id")
	var empresa models.Empresa
	if err := database.DB.First(&empresa, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Empresa não encontrada"})
		return
	}
	c.JSON(http.StatusOK, empresa)
}

// Atualizar empresa
func AtualizarEmpresa(c *gin.Context) {
	id := c.Param("id")
	var empresa models.Empresa
	if err := database.DB.First(&empresa, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Empresa não encontrada"})
		return
	}

	if err := c.ShouldBindJSON(&empresa); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}

	database.DB.Save(&empresa)
	c.JSON(http.StatusOK, empresa)
}

// Deletar empresa
func DeletarEmpresa(c *gin.Context) {
	id := c.Param("id")
	var empresa models.Empresa
	if err := database.DB.Delete(&empresa, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"mensagem": "Empresa deletada com sucesso"})
}
