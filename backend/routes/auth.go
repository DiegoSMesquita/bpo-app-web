package routes

import (
	"github.com/DiegoSMesquita/bpo-app-web-main/controllers"
	"github.com/gin-gonic/gin"
)

func AuthRoutes(r *gin.Engine) {
	r.POST("/login", controllers.Login)
}
