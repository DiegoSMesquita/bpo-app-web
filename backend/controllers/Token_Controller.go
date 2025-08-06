package controllers

import (
	"fmt"
	"math/rand"
	"net/http"
	"time"

	"github.com/DiegoSMesquita/bpo-app-web-main/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

func gerarToken(n int) string {
	b := make([]byte, n)
	for i := range b {
		b[i] = charset[rand.Intn(len(charset))]
	}
	return string(b)
}

// POST /contagens/:id/token
func GerarLinkContagem(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	id := c.Param("id")

	token := gerarToken(32)
	expira := time.Now().Add(48 * time.Hour)

	tokenObj := models.TokenContagem{
		Token:      token,
		ContagemID: parseUint(id),
		ValidoAte:  expira,
	}
	db.Create(&tokenObj)

	link := "https://app.bpoweb.com/contagem/mobile/" + token
	c.JSON(http.StatusOK, gin.H{"link": link})
}

// GET /contagem/mobile/:token
func AcessarContagemViaToken(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	token := c.Param("token")

	var tokenObj models.TokenContagem
	if err := db.Where("token = ?", token).First(&tokenObj).Error; err != nil || time.Now().After(tokenObj.ValidoAte) {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Link inválido ou expirado"})
		return
	}

	var contagem models.Contagem
	db.Preload("Itens").First(&contagem, tokenObj.ContagemID)
	c.JSON(http.StatusOK, contagem)
}

func parseUint(s string) uint {
	var i uint
	fmt.Sscanf(s, "%d", &i)
	return i
}
