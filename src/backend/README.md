# Backend API - Restaurant Digital Menu SaaS Platform

## Overview

Node.js/Express backend API for the multi-tenant Restaurant Digital Menu SaaS Platform.

## Features

- ✅ Multi-tenant architecture with tenant isolation
- ✅ JWT authentication and authorization
- ✅ RESTful API design
- ✅ MongoDB with Mongoose ODM
- ✅ Redis caching
- ✅ AWS S3 integration for image uploads
- ✅ Stripe billing integration
- ✅ QR code generation
- ✅ Analytics tracking
- ✅ Menu HTML rendering (EJS)
- ✅ Comprehensive error handling
- ✅ Rate limiting
- ✅ Input validation
- ✅ Unit tests

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Cache**: Redis
- **Storage**: AWS S3
- **Billing**: Stripe
- **Testing**: Jest
- **Template Engine**: EJS

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── services/        # Business logic
├── models/          # Mongoose schemas
├── repositories/    # Data access layer
├── middlewares/     # Express middlewares
├── routes/          # API routes
├── utils/           # Utility functions
└── views/           # EJS templates
```

## Setup

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Redis (optional, for caching)
- AWS account (for S3)
- Stripe account (for billing)

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration
```

### Environment Variables

See `.env.example` for all required environment variables.

### Running the Server

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new tenant
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/auth/me` - Get current user

### Restaurants
- `GET /api/v1/restaurants/:id` - Get restaurant
- `PUT /api/v1/restaurants/:id` - Update restaurant

### Categories
- `POST /api/v1/restaurants/:id/categories` - Create category
- `GET /api/v1/restaurants/:id/categories` - Get categories
- `PUT /api/v1/categories/:id` - Update category
- `DELETE /api/v1/categories/:id` - Delete category

### Dishes
- `POST /api/v1/restaurants/:id/dishes` - Create dish
- `PUT /api/v1/dishes/:id` - Update dish
- `DELETE /api/v1/dishes/:id` - Delete dish
- `PATCH /api/v1/dishes/:id/availability` - Toggle availability

### QR Codes
- `POST /api/v1/restaurants/:id/qrcode` - Generate QR code
- `GET /api/v1/restaurants/:id/qrcode` - Get QR code

### Upload
- `POST /api/v1/upload/presigned-url` - Get presigned URL for upload

### Analytics
- `GET /api/v1/restaurants/:id/analytics` - Get analytics

### Billing
- `GET /api/v1/billing` - Get billing info
- `POST /api/v1/billing/portal` - Create billing portal session

### Public Menu
- `GET /menu/:slug` - Render HTML menu
- `GET /menu/api/:slug` - Get menu JSON

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test auth.service.test.js

# Watch mode
npm run test:watch
```

## Architecture

- **Layered Architecture**: Controllers → Services → Repositories → Models
- **Multi-tenant**: Tenant isolation enforced at middleware level
- **Security**: JWT auth, rate limiting, input validation
- **Caching**: Redis for menu and restaurant data
- **Error Handling**: Centralized error handling middleware

## Development

### Code Style

- Follow ESLint configuration
- Use async/await for async operations
- Use try-catch in services
- Use catchAsync wrapper in controllers

### Adding New Features

1. Create model in `models/`
2. Create repository in `repositories/`
3. Create service in `services/`
4. Create controller in `controllers/`
5. Create routes in `routes/`
6. Add unit tests in `tests/unit/`

## License

ISC

