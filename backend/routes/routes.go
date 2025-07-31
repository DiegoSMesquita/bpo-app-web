import (
	"bpo-app-web-main/routes"
)

func HandleRequests() {
	r := gin.Default()
	r.POST("/register", controllers.Register
)

	routes.EmpresaRoutes(r)

	r.Run()
}