// controllers/contagem_controller.go
package controllers

import (
	"net/http"
	"time"

	"github.com/DiegoSMesquita/bpo-app-web-main/backend/models"
	"github.com/gin-gonic/gin"
)

func GetContagens(c *gin.Context) {
	var contagens []models.Contagem
	models.DB.Find(&contagens)
	c.JSON(http.StatusOK, contagens)
}

func CreateContagem(c *gin.Context) {
	var input models.Contagem
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	input.Status = "aberta"
	input.Progresso = 0
	input.Data = time.Now()
	models.DB.Create(&input)
	c.JSON(http.StatusOK, input)
}

func UpdateContagem(c *gin.Context) {
	var contagem models.Contagem
	if err := models.DB.First(&contagem, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Contagem não encontrada"})
		return
	}
	if err := c.ShouldBindJSON(&contagem); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	models.DB.Save(&contagem)
	c.JSON(http.StatusOK, contagem)
}

func DeleteContagem(c *gin.Context) {
	var contagem models.Contagem
	if err := models.DB.First(&contagem, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Contagem não encontrada"})
		return
	}
	models.DB.Delete(&contagem)
	c.JSON(http.StatusOK, gin.H{"message": "Contagem movida para lixeira"})
}

func GerarLinkContagem(c *gin.Context) {
	id := c.Param("id")
	link := "https://seusite.com/contagem/" + id
	c.JSON(http.StatusOK, gin.H{"link": link})
}
