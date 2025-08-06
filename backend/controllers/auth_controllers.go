package controllers

import (
	"net/http"

	"github.com/DiegoSMesquita/bpo-app-web-main/config"
	"github.com/DiegoSMesquita/bpo-app-web-main/models"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

// POST /register
func Register(c *gin.Context) {
	var input models.User

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Dados inválidos"})
		return
	}

	// Verifica se já existe um usuário com esse email
	var existingUser models.User
	if err := config.DB.Where("email = ?", input.Email).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Usuário já existe"})
		return
	}

	// Criptografar senha
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao gerar senha criptografada"})
		return
	}
	input.Password = string(hashedPassword)

	// Criar no banco
	if err := config.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao salvar no banco de dados"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Usuário criado com sucesso!"})
}

// POST /login
func Login(c *gin.Context) {
	var input models.LoginInput
	var user models.User

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Dados inválidos"})
		return
	}

	if err := config.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Usuário não encontrado"})
		return
	}

	// Comparar senha
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Senha incorreta"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Login realizado com sucesso",
		"user":    user,
	})
}
