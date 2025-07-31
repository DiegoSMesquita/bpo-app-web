package main

import (
	"log"
	"net/http"
	"os"

	"github.com/DiegoSMesquita/bpo-app-web-main/config"
	"github.com/DiegoSMesquita/bpo-app-web-main/routes"
	"github.com/joho/godotenv"
)

func main() {
	// Carregar .env
	if err := godotenv.Load(); err != nil {
		log.Println("Arquivo .env não encontrado, usando variáveis de ambiente do sistema")
	}

	// Conectar ao banco
	db := config.ConnectDB()
	sqlDB, err := db.DB()
	if err != nil {
		log.Fatal("Erro ao abrir conexão com o banco:", err)
	}
	defer sqlDB.Close()

	// Iniciar rotas
	router := routes.SetupRouter()

	// Porta
	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}

	log.Printf("Servidor rodando em http://localhost:%s", port)
	err = http.ListenAndServe(":"+port, router)
	if err != nil {
		log.Fatal("Erro ao iniciar servidor:", err)
	}
}
