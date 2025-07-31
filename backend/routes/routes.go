package routes

import (
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	AuthRoutes(r)
	EmpresaRoutes(r)

	return r
}
