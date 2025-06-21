# 🐱 NestJS Cats API

A simple RESTful API built with [NestJS](https://nestjs.com/), [Prisma](https://www.prisma.io/), and PostgreSQL (via Docker).  
Performs basic CRUD operations on a Cat resource.

---

## 📦 Tech Stack

- [NestJS](https://nestjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/) (via Docker)
- TypeScript

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/Bart-15/nest-cat-api.git
cd nest-cats-api
```

### 2. Set up PostgreSQL with Docker

> Create a file called `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: postgres-1
    restart: unless-stopped
    ports:
      - '5432:5432'
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: cats_db
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

```bash
# Run the container
docker-compose up -d
```

### 3. Set up Environment Variables

> Create a `.env` file in the root:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/cats_db?schema=public"
```

---

## 🔧 Prisma Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations (optional: if you have a schema)
npx prisma migrate dev --name init
```

---

## 🧪 Run the App

```bash
npm run start:dev
```

Open in browser or use Postman:

```
GET http://localhost:3000/cats
```

---

## 🧰 Available Endpoints

| Method | Route          | Description             |
| ------ | -------------- | ----------------------- |
| GET    | `/cats`        | Get all cats            |
| GET    | `/cats/:id`    | Get a single cat        |
| POST   | `/cats`        | Create a new cat        |
| PUT    | `/cats/:id`    | Update a cat            |
| DELETE | `/cats/:id`    | Delete a cat            |
| GET    | `/cats?breed=` | Filter by breed (query) |

---

## 🧪 How to Test

```bash
# Run unit tests
npm run test
```

---

## 📁 Project Structure

```
src/
├── cats/
│   ├── cats.controller.ts
│   ├── cats.service.ts
│   ├── cats.module.ts
├── prisma/
│   └── schema.prisma
├── app.module.ts
└── main.ts
```
