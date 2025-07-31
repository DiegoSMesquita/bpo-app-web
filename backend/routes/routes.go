package routes

import (
	"github.com/DiegoSMesquita/bpo-app-web-main/controllers"
	"github.com/gin-gonic/gin"
)

func HandleRequests() {
	r := gin.Default()
	r.POST("/register", controllers.Register)

	r.Run()
}
