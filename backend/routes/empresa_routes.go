package routes

import (
	"github.com/DiegoSMesquita/bpo-app-web-main/controllers"

	"github.com/gin-gonic/gin"
)

func EmpresaRoutes(router *gin.Engine) {
	empresa := router.Group("/empresas")
	{
		empresa.POST("/", controllers.CriarEmpresa)
		empresa.GET("/", controllers.ListarEmpresas)
	}
}
