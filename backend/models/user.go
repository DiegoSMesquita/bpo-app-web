package models

type User struct {
	ID          uint   `gorm:"primaryKey" json:"id"`
	Email       string `json:"email" binding:"required" gorm:"unique"`
	Password    string `gorm:"not null" json:"password"`
	UserType    string `json:"userType"`    // admin, client, employee
	CompanyCode string `json:"companyCode"` // usado por funcionário
}

type LoginInput struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}
