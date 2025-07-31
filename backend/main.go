// main.go
package main

import (
	"bpo-backend/config"
	"bpo-backend/routes"
	"log"
	"net/http"
	"os"
	"bpo-app-web-main/models"
"github.com/DiegoSMesquita/bpo-app-web-main/config"
	"github.com/DiegoSMesquita/bpo-app-web-main/routes"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	config.LoadEnv()
	config.ConnectDB()
	r := gin.Default()
	routes.AuthRoutes(r)
	//Futuras rotas protegidas: 
	// routes.UserRoutes(r)
	r.Run()

	// Carregar variáveis de ambiente
	err := godotenv.Load()
	if err != nil {
		log.Println("Erro ao carregar .env, usando variáveis do ambiente do sistema")
	}

	// Conectar ao banco de dados
	db := config.ConnectDB()
	sqlDB, _ := db.DB()
	defer sqlDB.Close()

	// Registrar rotas
	router := routes.SetupRouter()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Servidor rodando na porta %s...", port)
	http.ListenAndServe(":"+port, router)


	func ConectaComBanco() {
    var err error
    DB, err = gorm.Open(...)
    
    DB.AutoMigrate(&models.Empresa{}) // adiciona aqui
}
}
