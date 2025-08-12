// routes/contagem_routes.go
package routes

import (
	"github.com/DiegoSMesquita/bpo-app-web-main/backend/controllers"
	"github.com/gin-gonic/gin"
)

func ContagemRoutes(r *gin.Engine) {
	cont := r.Group("/contagens")
	{
		cont.GET("/", controllers.GetContagens)
		cont.POST("/", controllers.CreateContagem)
		cont.PUT("/:id", controllers.UpdateContagem)
		cont.DELETE("/:id", controllers.DeleteContagem)
		cont.POST("/:id/token", controllers.GerarLinkContagem)
	}
}
