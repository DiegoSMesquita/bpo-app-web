package controllers

import (
	"net/http"
	"strconv"

	"github.com/DiegoSMesquita/bpo-app-web-main/backend/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// GET /contagens/:id
func GetContagem(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	id := c.Param("id")
	var contagem models.Contagem

	if err := db.Preload("Itens").First(&contagem, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Contagem não encontrada"})
		return
	}

	c.JSON(http.StatusOK, contagem)
}

// POST /contagens/:id/respostas
func SalvarContagemFuncionario(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	id := c.Param("id")

	var respostas []models.RespostaContagem
	if err := c.ShouldBindJSON(&respostas); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Dados inválidos"})
		return
	}

	for i := range respostas {
		respostas[i].ContagemID, _ = strconv.ParseUint(id, 10, 64)
		db.Create(&respostas[i])
	}

	c.JSON(http.StatusOK, gin.H{"message": "Contagem salva com sucesso!"})
}
