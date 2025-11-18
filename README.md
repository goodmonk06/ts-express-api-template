# TypeScript Express API Template

A production-ready Express + TypeScript REST API template with authentication, database integration, and comprehensive tooling.

## Overview

This template provides a solid foundation for building scalable REST APIs with TypeScript and Express. It includes a complete authentication system, database integration with Prisma ORM, comprehensive testing setup, and Docker support for easy deployment.

The project follows clean architecture principles with clear separation of concerns across layers: routes, controllers, services, and data access.

## Tech Stack

**Core:**
- **Node.js 22** - JavaScript runtime
- **TypeScript 5.9** - Type-safe JavaScript
- **Express 5** - Web framework
- **PostgreSQL** - Relational database
- **Prisma 6** - Type-safe ORM

**Authentication & Security:**
- **JWT** - Token-based authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **express-rate-limit** - API rate limiting

**Validation & Logging:**
- **Zod** - Schema validation
- **Winston** - Structured logging

**Development & Testing:**
- **Jest** - Testing framework
- **Supertest** - HTTP assertion library
- **ESLint + Prettier** - Code quality tools
- **ts-node-dev** - Development hot reload

**DevOps:**
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **GitHub Actions** - CI/CD pipeline

**Documentation:**
- **Swagger/OpenAPI** - Interactive API documentation

## Domain Model

### User Entity

The core entity in this system is the **User**, representing authenticated users of the API.

**Fields:**
- `id` (UUID) - Unique identifier
- `email` (String, unique) - User email address
- `password` (String, hashed) - User password
- `name` (String, optional) - User display name
- `createdAt` (DateTime) - Account creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

**Key Operations:**
- User registration with email/password
- User authentication (login)
- Profile management (read, update, delete)
- User listing (authenticated users only)

## Getting Started

### Requirements

- **Node.js** >= 22.x
- **pnpm** >= 10.x (or npm/yarn)
- **PostgreSQL** >= 14.x (or use Docker Compose)
- **Docker** & **Docker Compose** (optional, recommended)

### Setup Steps

#### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd ts-express-api-template

# Install dependencies
pnpm install
```

#### 2. Environment Configuration

```bash
# Copy example environment file
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mydb?schema=public"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

#### 3. Database Setup

**Option A: Using Docker Compose (Recommended)**

```bash
# Start PostgreSQL and application
docker-compose up -d

# The database migrations will run automatically
# Seed the database with demo data
docker-compose exec app pnpm db:seed
```

**Option B: Local PostgreSQL**

```bash
# Generate Prisma Client
pnpm db:generate

# Run database migrations
pnpm db:migrate

# Seed the database with demo data
pnpm db:seed
```

#### 4. Start Development Server

```bash
# Start with hot reload
pnpm dev
```

The API will be available at `http://localhost:3000`

## Example Flow: User Management

This implementation provides a complete vertical slice for user management, from registration to CRUD operations.

### 1. Register a New User

```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "password": "demo123"
  }'
```

**Demo Credentials:**
- Email: `demo@example.com`
- Password: `demo123`

### 3. Get Profile (Protected)

```bash
curl http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Update Profile

```bash
curl -X PUT http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe"
  }'
```

### 5. List All Users

```bash
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 6. Interactive API Documentation

Visit `http://localhost:3000/api-docs` to explore and test all endpoints using Swagger UI.

## Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server with hot reload |
| `pnpm build` | Compile TypeScript to JavaScript |
| `pnpm start` | Run the production build |
| `pnpm test` | Run all tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:coverage` | Run tests with coverage report |
| `pnpm lint` | Check code for linting errors |
| `pnpm lint:fix` | Fix auto-fixable linting errors |
| `pnpm format` | Format code with Prettier |
| `pnpm format:check` | Check code formatting |
| `pnpm db:generate` | Generate Prisma Client |
| `pnpm db:migrate` | Run database migrations |
| `pnpm db:push` | Push schema changes without migration |
| `pnpm db:seed` | Seed database with demo data |
| `pnpm db:reset` | Reset database and re-run migrations |
| `pnpm db:studio` | Open Prisma Studio (database GUI) |

## Testing

This project includes comprehensive test coverage across multiple layers:

- **Unit Tests**: Services, utilities, validation schemas
- **Integration Tests**: API endpoints with authentication
- **End-to-End Tests**: Complete user flows

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

**Test Coverage:**
- Authentication service (password hashing, JWT tokens)
- User validation schemas
- User API endpoints (registration, login, CRUD)
- Rate limiting
- Error handling

## Future Extensions

Potential enhancements for this template:

### Features
- **Role-Based Access Control (RBAC)** - Admin, user, guest roles
- **Email Verification** - Email confirmation for new accounts
- **Password Reset** - Forgot password flow with email tokens
- **Refresh Tokens** - Long-lived refresh tokens for better UX
- **Two-Factor Authentication (2FA)** - TOTP-based 2FA

### Additional Entities
- **Posts** - User-generated content system
- **Comments** - Threaded discussions
- **Tags/Categories** - Content organization

### Infrastructure
- **Redis Caching** - Session storage and caching layer
- **WebSocket Support** - Real-time features
- **Background Jobs** - Async task processing
- **Monitoring** - Error tracking and metrics

## License

ISC

---

**Quick Start Checklist:**

- [ ] Clone repository
- [ ] Run `pnpm install`
- [ ] Copy `.env.example` to `.env`
- [ ] Run `docker-compose up -d`
- [ ] Run `pnpm db:seed`
- [ ] Visit `http://localhost:3000/api-docs`
- [ ] Login with `demo@example.com` / `demo123`
