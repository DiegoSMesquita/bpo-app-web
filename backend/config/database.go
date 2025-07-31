package config

import (
	"fmt"
	"log"
	"os"

	"github.com/DiegoSMesquita/bpo-app-web-main/models"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() *gorm.DB {
	dsn := fmt.Sprintf("%s:%s@tcp(%s)/%s?parseTime=true",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_NAME"),
	)

	database, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Erro ao conectar ao banco:", err)
	}

	// Migrar os models
	err = database.AutoMigrate(&models.User{}, &models.Empresa{})
	if err != nil {
		log.Fatal("Erro ao fazer auto migrate:", err)
	}

	DB = database
	return DB
}
