package routes

import (
	"github.com/DiegoSMesquita/bpo-app-web-main/config"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()
	// Aplica o middleware de CORS
	r.Use(config.SetupCORS())
	AuthRoutes(r)
	EmpresaRoutes(r)

	return r
}
