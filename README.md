# TypeScript Express API Template

A minimal, production-ready Express + TypeScript REST API template with a clean layered architecture.

## Features

- **TypeScript** - Type safety and modern JavaScript features
- **Express.js** - Fast, minimalist web framework
- **Clean Architecture** - Organized in layers (routes, controllers, services, middleware)
- **Environment Variables** - Configuration management with dotenv
- **Code Quality** - ESLint + Prettier for consistent code style
- **Development Tools** - Hot reload with ts-node-dev
- **Production Ready** - Compiled TypeScript output for deployment

## Project Structure

```
ts-express-api-template/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Custom middleware
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── app.ts          # Express app setup
│   └── index.ts        # Application entry point
├── dist/               # Compiled JavaScript (after build)
├── .env.example        # Environment variables template
├── tsconfig.json       # TypeScript configuration
├── eslint.config.mjs   # ESLint configuration
└── .prettierrc         # Prettier configuration
```

## Prerequisites

- **Node.js** >= 22.x
- **pnpm** (recommended) or npm

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
PORT=3000
NODE_ENV=development
```

### 3. Development

Run the application in development mode with hot reload:

```bash
pnpm dev
```

The server will start at `http://localhost:3000`

### 4. Build for Production

Compile TypeScript to JavaScript:

```bash
pnpm build
```

This creates a `dist/` directory with compiled JavaScript files.

### 5. Start Production Server

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
| `pnpm lint` | Check code for linting errors |
| `pnpm lint:fix` | Fix auto-fixable linting errors |
| `pnpm format` | Format code with Prettier |
| `pnpm format:check` | Check code formatting |

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

## Adding New Features

### Creating a New Endpoint

1. **Create a Service** in `src/services/`:
   ```typescript
   export class ExampleService {
     getData() {
       return { message: 'Hello World' };
     }
   }
   export const exampleService = new ExampleService();
   ```

2. **Create a Controller** in `src/controllers/`:
   ```typescript
   import { Request, Response } from 'express';
   import { exampleService } from '../services/example.service';

   export class ExampleController {
     async getData(req: Request, res: Response): Promise<void> {
       const data = exampleService.getData();
       res.json(data);
     }
   }
   export const exampleController = new ExampleController();
   ```

3. **Create a Route** in `src/routes/`:
   ```typescript
   import { Router } from 'express';
   import { exampleController } from '../controllers/example.controller';

   const router = Router();
   router.get('/example', (req, res) => exampleController.getData(req, res));

   export default router;
   ```

4. **Register the Route** in `src/routes/index.ts`:
   ```typescript
   import exampleRoutes from './example.routes';
   router.use(exampleRoutes);
   ```

## Environment Variables

Configure your application using environment variables in `.env`:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment (development/production) | `development` |

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

## License

ISC

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
