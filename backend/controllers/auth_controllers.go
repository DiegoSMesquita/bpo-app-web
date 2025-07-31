package controllers

import (
	"net/http"
	"os"
	"time"

	"bpo-app-web-main/config"
	"bpo-app-web-main/models"

	"github.com/DiegoSMesquita/bpo-app-web-main/config"
	"github.com/DiegoSMesquita/bpo-app-web-main/models"
	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/gommon/log"
	"golang.org/x/crypto/bcrypt"

	"github.com/gin-gonic/gin"
)

type LoginInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

func Register(c *gin.Context) {
	var input struct {
		Name     string `json:"name" binding:"required"`
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required,min=6"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"Error": "Error ao criptografar a senha"})
		return
	}

	user := models.User{
		Name:     input.Name,
		Email:    input.Email,
		Password: input.Password,
	}

	if err := config.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao criar usuário"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Usuário criado com sucesso"})

	// Verificar se o usuário já existe
	var user models.User
	if err := config.DB.Where("email = ?", input.Email).First(&user).Error; err == nil {
		c.JSON(409, gin.H{"error": "Usuário já existe"})
		return
	}

	// Hash da senha
	hash, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(500, gin.H{"error": "Erro ao criar usuário"})
		return
	}
	user.PasswordHash = string(hash)

	if err := config.DB.Create(&user).Error; err != nil {
		c.JSON(500, gin.H{"error": "Erro ao criar usuário"})
		return
	}

	c.JSON(201, gin.H{"message": "Usuário criado com sucesso", "user_id": user.ID})
}

func Login(c *gin.Context) {
	var input LoginInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": "Dados inválidos"})
		return
	}

	var user models.User
	if err := config.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		c.JSON(401, gin.H{"error": "Credenciais inválidas"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.Password)); err != nil {
		c.JSON(401, gin.H{"error": "Credenciais inválidas"})
		return
	}

	// Gerar token JWT
	secret := os.Getenv("JWT_SECRET")
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"exp":     time.Now().Add(time.Hour * 72).Unix(),
	})

	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		log.Error("Erro ao assinar o token JWT:", err)
		c.JSON(500, gin.H{"error": "Erro interno"})
		return
	}

	c.JSON(200, gin.H{
		"token": tokenString,
		"user": gin.H{
			"id":    user.ID,
			"name":  user.Name,
			"email": user.Email,
		},
	})
}
