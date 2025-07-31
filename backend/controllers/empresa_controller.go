package controllers

import (
	"net/http"

	"github.com/DiegoSMesquita/bpo-app-web-main/config"
	"github.com/DiegoSMesquita/bpo-app-web-main/models"
	"github.com/gin-gonic/gin"
)

func CriarEmpresa(c *gin.Context) {
	var novaEmpresa models.Empresa

	if err := c.ShouldBindJSON(&novaEmpresa); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "Dados inválidos", "detalhes": err.Error()})
		return
	}

	if err := config.DB.Create(&novaEmpresa).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao criar empresa", "detalhes": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, novaEmpresa)
}

func ListarEmpresas(c *gin.Context) {
	var empresas []models.Empresa

	if err := config.DB.Find(&empresas).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao buscar empresas", "detalhes": err.Error()})
		return
	}

	c.JSON(http.StatusOK, empresas)
}

func BuscarEmpresa(c *gin.Context) {
	id := c.Param("id")
	var empresa models.Empresa

	if err := config.DB.First(&empresa, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Empresa não encontrada"})
		return
	}

	c.JSON(http.StatusOK, empresa)
}

func AtualizarEmpresa(c *gin.Context) {
	id := c.Param("id")
	var empresa models.Empresa

	if err := config.DB.First(&empresa, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Empresa não encontrada"})
		return
	}

	if err := c.ShouldBindJSON(&empresa); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "Dados inválidos", "detalhes": err.Error()})
		return
	}

	if err := config.DB.Save(&empresa).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao atualizar empresa", "detalhes": err.Error()})
		return
	}

	c.JSON(http.StatusOK, empresa)
}

func DeletarEmpresa(c *gin.Context) {
	id := c.Param("id")

	if err := config.DB.Delete(&models.Empresa{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao deletar empresa", "detalhes": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"mensagem": "Empresa deletada com sucesso"})
}
