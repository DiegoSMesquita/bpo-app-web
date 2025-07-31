BPO Finance Backend (Go + MySQL)

Este projeto implementa a estrutura inicial de backend para o sistema BPO Finance, utilizando Golang, GORM, MySQL e Gorilla Mux.

✅ Tecnologias Usadas

Golang 1.21+

GORM ORM

MySQL

Gorilla Mux

.env para configuração segura

⚙️ Como rodar localmente

1. Clonar o repositório

git clone https://github.com/seu-usuario/bpo-backend.git
cd bpo-backend

2. Criar o arquivo .env

Crie um arquivo .env na raiz:

DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_HOST=localhost
DB_PORT=3306
DB_NAME=nome_do_banco
APP_PORT=8080

Importante: nunca suba o .env para o GitHub.

3. Rodar com Go

go mod tidy
go run main.go

🐳 Rodar com Docker

1. Crie o Dockerfile:

FROM golang:1.21-alpine

WORKDIR /app
COPY . .

RUN go mod tidy
RUN go build -o main .

CMD ["./main"]

2. Crie o docker-compose.yml:

version: '3.8'
services:
  mysql:
    image: mysql:8.0
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: nome_do_banco
      MYSQL_USER: seu_usuario
      MYSQL_PASSWORD: sua_senha
    ports:
      - "3306:3306"
    volumes:
      - ./mysql-data:/var/lib/mysql

  backend:
    build: .
    ports:
      - "8080:8080"
    depends_on:
      - mysql
    env_file:
      - .env

3. Executar:

docker-compose up --build

📚 Rotas disponíveis

GET /empresas → Lista todas empresas

GET /empresas/{id} → Busca uma empresa por ID

POST /empresas → Cria uma nova empresa

PUT /empresas/{id} → Atualiza dados da empresa

DELETE /empresas/{id} → Remove a empresa (soft delete)

🧱 Estrutura de Pastas

├── config
│   └── db.go
├── controllers
│   └── empresa_controller.go
├── models
│   └── empresa.go
├── routes
│   └── routes.go
├── .env (oculto)
├── main.go

✨ Futuro

Autenticação com JWT

Validação de campos com validator

Swagger/OpenAPI docs

👨‍💻 Autor

Diego Mesquita

