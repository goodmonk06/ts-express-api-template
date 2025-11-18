# TypeScript Express API Template

A production-ready Express + TypeScript REST API template with authentication, database integration, and comprehensive tooling.

## Features

- **TypeScript** - Type safety and modern JavaScript features
- **Express.js** - Fast, minimalist web framework
- **PostgreSQL + Prisma** - Type-safe database ORM
- **JWT Authentication** - Secure user authentication with JSON Web Tokens
- **Validation** - Request validation with Zod
- **Logging** - Structured logging with Winston
- **CORS** - Configurable Cross-Origin Resource Sharing
- **Rate Limiting** - Request rate limiting for API protection
- **API Documentation** - Interactive Swagger/OpenAPI documentation
- **Testing** - Jest with Supertest for comprehensive testing
- **Docker** - Multi-stage Dockerfile and Docker Compose setup
- **CI/CD** - GitHub Actions workflow for automated testing and building
- **Code Quality** - ESLint + Prettier for consistent code style
- **Clean Architecture** - Organized in layers (routes, controllers, services, middleware, validators)

## Project Structure

```
ts-express-api-template/
├── .github/
│   └── workflows/        # GitHub Actions CI/CD workflows
├── prisma/
│   └── schema.prisma     # Prisma database schema
├── src/
│   ├── config/           # Configuration files (env, database, logger, jwt, swagger)
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Custom middleware (auth, validation, logger, error)
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── validators/       # Zod validation schemas
│   ├── app.ts            # Express app setup
│   └── index.ts          # Application entry point
├── tests/                # Test files
├── logs/                 # Application logs
├── dist/                 # Compiled JavaScript (after build)
├── .env.example          # Environment variables template
├── docker-compose.yml    # Docker Compose configuration
├── Dockerfile            # Docker configuration
├── jest.config.js        # Jest testing configuration
├── tsconfig.json         # TypeScript configuration
├── eslint.config.mjs     # ESLint configuration
└── .prettierrc           # Prettier configuration
```

## Prerequisites

- **Node.js** >= 22.x
- **pnpm** (recommended) or npm
- **PostgreSQL** (or use Docker Compose)
- **Docker** (optional, for containerized development)

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Environment Variables

Copy the example environment file and configure as needed:

```bash
cp .env.example .env
```

Edit `.env` to set your configuration:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### 3. Database Setup

Generate Prisma Client:

```bash
pnpm prisma:generate
```

Run database migrations:

```bash
pnpm prisma:migrate
```

### 4. Development

Run the application in development mode with hot reload:

```bash
pnpm dev
```

The server will start at `http://localhost:3000`

### 5. Using Docker

Start the entire stack (app + PostgreSQL) with Docker Compose:

```bash
docker-compose up -d
```

Stop the services:

```bash
docker-compose down
```

### 6. Build for Production

Compile TypeScript to JavaScript:

```bash
pnpm build
```

This creates a `dist/` directory with compiled JavaScript files.

### 7. Start Production Server

Run the compiled application:

```bash
pnpm start
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server with hot reload |
| `pnpm build` | Compile TypeScript to JavaScript |
| `pnpm start` | Run the production build |
| `pnpm test` | Run tests with Jest |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:coverage` | Run tests with coverage report |
| `pnpm lint` | Check code for linting errors |
| `pnpm lint:fix` | Fix auto-fixable linting errors |
| `pnpm format` | Format code with Prettier |
| `pnpm format:check` | Check code formatting |
| `pnpm prisma:generate` | Generate Prisma Client |
| `pnpm prisma:migrate` | Run database migrations |
| `pnpm prisma:studio` | Open Prisma Studio |

## API Endpoints

### Health Check

Check if the API is running:

```
GET /api/health
```

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Authentication

#### Register a new user

```
POST /api/users/register
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
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
    "token": "jwt-token"
  }
}
```

#### Login

```
POST /api/users/login
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "jwt-token"
  }
}
```

### User Management (Protected Routes)

All user management routes require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <jwt-token>
```

#### Get current user profile

```
GET /api/users/profile
```

#### Get all users

```
GET /api/users
```

#### Get user by ID

```
GET /api/users/:id
```

#### Update current user

```
PUT /api/users/profile
```

**Request Body:**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

#### Delete current user

```
DELETE /api/users/profile
```

## API Documentation

Interactive API documentation is available via Swagger UI at:

```
http://localhost:3000/api-docs
```

## Database

This template uses PostgreSQL with Prisma ORM. The database schema is defined in `prisma/schema.prisma`.

### Prisma Commands

- **Generate Client**: `pnpm prisma:generate`
- **Create Migration**: `pnpm prisma:migrate`
- **Reset Database**: `pnpm prisma migrate reset`
- **Open Prisma Studio**: `pnpm prisma:studio`

## Testing

This project uses Jest and Supertest for testing.

Run tests:

```bash
pnpm test
```

Run tests with coverage:

```bash
pnpm test:coverage
```

Run tests in watch mode:

```bash
pnpm test:watch
```

## Environment Variables

Configure your application using environment variables in `.env`:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment (development/production) | `development` |
| `DATABASE_URL` | PostgreSQL connection string | - |
| `JWT_SECRET` | Secret key for JWT signing | - |
| `JWT_EXPIRES_IN` | JWT token expiration time | `7d` |
| `ALLOWED_ORIGINS` | Allowed CORS origins (comma-separated) | `*` |

## Docker Deployment

### Build Docker Image

```bash
docker build -t ts-express-api .
```

### Run with Docker Compose

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- API server on port 3000

### Stop Services

```bash
docker-compose down
```

## Code Quality

### Linting

This project uses ESLint with TypeScript support:

```bash
pnpm lint        # Check for issues
pnpm lint:fix    # Auto-fix issues
```

### Formatting

Code formatting is handled by Prettier:

```bash
pnpm format       # Format all files
pnpm format:check # Check formatting
```

## CI/CD

This project includes a GitHub Actions workflow that:

- Runs linting and formatting checks
- Executes tests with coverage
- Builds the TypeScript project
- Builds Docker image
- Uploads coverage reports to Codecov

The workflow runs on every push and pull request to `main` and `develop` branches.

## Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt for secure password storage
- **Rate Limiting** - Protection against brute-force attacks
- **CORS** - Configurable cross-origin requests
- **Input Validation** - Zod schemas for request validation
- **Environment Variables** - Sensitive data kept in environment variables

## Logging

Application logs are stored in the `logs/` directory:

- `all.log` - All application logs
- `error.log` - Error-level logs only

Logs are also output to the console with color-coding in development mode.

## License

ISC

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For issues and questions, please open an issue on GitHub.
