package routes

import (
	"bpo-app-web-main/controllers"

	"github.com/gin-gonic/gin"
)

func EmpresaRoutes(r *gin.Engine) {
	grupo := r.Group("/empresas")
	{
		grupo.POST("/", controllers.CriarEmpresa)
		grupo.GET("/", controllers.ListarEmpresas)
		grupo.GET("/:id", controllers.BuscarEmpresa)
		grupo.PUT("/:id", controllers.AtualizarEmpresa)
		grupo.DELETE("/:id", controllers.DeletarEmpresa)
	}
}
