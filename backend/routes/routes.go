package routes

import (
	"github.com/DiegoSMesquita/bpo-app-web-main/config"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	router := gin.Default()
	// Aplica o middleware de CORS
	router.Use(config.SetupCORS())
	AuthRoutes(router)
	EmpresaRoutes(router)

	return router
}
