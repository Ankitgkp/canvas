# Server Architecture Documentation

## Project Structure

```
server/
├── server.ts          # Main server file (entry point)
├── routes.ts          # API routes definition
├── middleware.ts      # Custom middleware functions
├── database.ts        # Database configuration and singleton
└── config.ts          # Environment variables and configuration
```

## Files Overview

### 🚀 server.ts (Entry Point)
- Main Express app setup
- Middleware configuration
- Route mounting
- Server startup and graceful shutdown

### 🛣️ routes.ts (API Routes)
All API endpoints are defined here:
- `POST /api/register` - User registration
- `POST /api/login` - User authentication
- `GET /api/profile` - Get user profile (protected)
- `POST /api/verify-token` - Verify JWT token
- `GET /api/health` - Health check endpoint

### 🛡️ middleware.ts (Security & Utilities)
- `authenticateToken` - JWT token verification
- `errorHandler` - Global error handling
- `notFoundHandler` - 404 handler

### 🗄️ database.ts (Database Layer)
- Prisma Client singleton pattern
- Database connection management
- Logging configuration

### ⚙️ config.ts (Configuration)
Centralized configuration management:
- Server settings (PORT, NODE_ENV)
- Security settings (JWT_SECRET, CORS)
- Database settings
- Environment validation

## Environment Variables

Create a `.env` file with:

```env
# Database
DATABASE_URL="file:./dev.db"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="24h"

# Server Configuration
PORT=3001
NODE_ENV="development"

# CORS Origins (comma-separated)
CORS_ORIGINS="http://localhost:5173,http://localhost:3000"
```

## API Endpoints

### Authentication Routes

#### Register User
```
POST /api/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "password123"
}
```

#### Login User
```
POST /api/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Verify Token
```
POST /api/verify-token
Content-Type: application/json

{
  "token": "jwt-token-here"
}
```

### Protected Routes

#### Get User Profile
```
GET /api/profile
Authorization: Bearer jwt-token-here
```

### Utility Routes

#### Health Check
```
GET /api/health
```

## Security Features

- ✅ JWT token authentication
- ✅ Password hashing with bcrypt
- ✅ CORS protection
- ✅ Input validation
- ✅ Error handling
- ✅ Rate limiting ready (middleware available)

## Database Schema

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  username  String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
```

## Running the Server

```bash
# Development (with auto-reload)
npm run server

# Start both frontend and backend
npm run dev:full
```

## Benefits of This Architecture

1. **Separation of Concerns** - Each file has a specific responsibility
2. **Maintainability** - Easy to locate and modify specific functionality
3. **Scalability** - Easy to add new routes, middleware, or services
4. **Testability** - Individual components can be tested in isolation
5. **Configuration Management** - Centralized environment handling
6. **Error Handling** - Consistent error responses across the API
7. **Security** - Middleware-based authentication and validation

## Future Enhancements

- [ ] Add request logging middleware
- [ ] Implement rate limiting
- [ ] Add API documentation with Swagger
- [ ] Add request validation schemas
- [ ] Implement caching layer
- [ ] Add monitoring and health checks
- [ ] Add unit and integration tests
