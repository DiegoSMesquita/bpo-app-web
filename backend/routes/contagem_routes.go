package routes

import (
	"github.com/DiegoSMesquita/bpo-app-web-main/backend/routes"
	"github.com/DiegoSMesquita/bpo-app-web-main/backend/routes/auth"
	"github.com/DiegoSMesquita/bpo-app-web-main/backend/routes/empresa_routes"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	auth.AuthRoutes(r)
	empresa_routes.EmpresaRoutes(r)
	routes.ContagemRoutes(r)
}
