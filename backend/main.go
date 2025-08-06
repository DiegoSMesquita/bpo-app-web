package main

import (
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"github.com/DiegoSMesquita/bpo-app-web-main/config"
	"github.com/DiegoSMesquita/bpo-app-web-main/routes"
)

func main() {
	// Carrega variáveis de ambiente do arquivo .env
	if err := godotenv.Load(); err != nil {
		log.Println("Arquivo .env não encontrado, usando variáveis do sistema")
	}

	// Conecta ao banco de dados
	config.ConnectDB()

	// Cria o servidor
	r := gin.Default()

	// Middleware CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool {
			return true // PERMITE TODAS AS ORIGENS (útil para desenvolvimento)
		},
	}))
	// Rotas
	routes.AuthRoutes(r)
	routes.EmpresaRoutes(r)

	// Porta (definida via .env ou padrão 8081)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}

	log.Printf("Servidor rodando na porta %s...\n", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Erro ao iniciar servidor: %v", err)
	}
}
