package controllers

import (
	"net/http"

	"github.com/DiegoSMesquita/bpo-app-web-main/backend/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetContagens(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	var contagens []models.Contagem
	db.Find(&contagens)
	c.JSON(http.StatusOK, contagens)
}

func GetContagemByID(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	id := c.Param("id")
	var contagem models.Contagem
	if err := db.First(&contagem, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Contagem não encontrada"})
		return
	}
	c.JSON(http.StatusOK, contagem)
}

func UpdateContagem(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	id := c.Param("id")
	var contagem models.Contagem
	if err := db.First(&contagem, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Contagem não encontrada"})
		return
	}
	if err := c.ShouldBindJSON(&contagem); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.Save(&contagem)
	c.JSON(http.StatusOK, contagem)
}

func DeleteContagem(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	id := c.Param("id")
	var contagem models.Contagem
	if err := db.First(&contagem, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Contagem não encontrada"})
		return
	}
	db.Delete(&contagem)
	c.JSON(http.StatusOK, gin.H{"message": "Contagem apagada com sucesso"})
}

func UpdateTempoContagem(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	id := c.Param("id")
	var input struct {
		TempoRestante string `json:"tempo_restante"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var contagem models.Contagem
	if err := db.First(&contagem, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Contagem não encontrada"})
		return
	}
	contagem.TempoRestante = input.TempoRestante
	db.Save(&contagem)
	c.JSON(http.StatusOK, contagem)
}
