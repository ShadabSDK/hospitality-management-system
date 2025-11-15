# Hospitality Management System - Backend API

Multi-tenant restaurant digital menu SaaS backend built with Node.js, Express, and MongoDB.

## Features

- **Multi-Tenant Architecture**: Shared database with tenant isolation
- **Authentication**: JWT-based auth with role-based access control
- **Restaurant Management**: CRUD for restaurants, menus, dishes, and categories
- **QR Code Generation**: Dynamic menu QR codes
- **Public Menu Viewer**: Responsive HTML menu rendering
- **Stripe Billing**: SaaS subscription management
- **Analytics**: Track menu views, QR scans, and user interactions
- **Background Jobs**: Bull queue for async operations
- **AWS S3 Integration**: Image uploads for restaurants and dishes

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Payment**: Stripe
- **File Storage**: AWS S3
- **Job Queue**: Bull + Redis
- **Template Engine**: EJS

## Project Structure

```
src/
├── app.js                 # Express setup
├── controllers/           # Request handlers
├── models/               # Mongoose schemas
├── routes/               # API routes
├── middlewares/          # Auth, tenant validation, error handling
├── services/             # Business logic (Stripe, S3, etc.)
├── jobs/                 # Background job processors
├── utils/                # Helpers (logger, validator, paginator)
└── views/                # EJS templates for menu
```

## Installation

```bash
npm install
```

## Environment Setup

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

## Running

**Development**:
```bash
npm run dev
```

**Production**:
```bash
npm start
```

**Testing**:
```bash
npm test
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new tenant
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Restaurants
- `POST /api/restaurants` - Create restaurant
- `GET /api/restaurants/:id` - Get restaurant
- `PUT /api/restaurants/:id` - Update restaurant

### Categories
- `POST /api/restaurants/:restaurantId/categories` - Create category
- `GET /api/restaurants/:restaurantId/categories` - List categories
- `PUT /api/categories/:categoryId` - Update category
- `DELETE /api/categories/:categoryId` - Delete category

### Dishes
- `POST /api/restaurants/:restaurantId/dishes` - Create dish
- `GET /api/restaurants/:restaurantId/dishes` - List dishes
- `PUT /api/dishes/:dishId` - Update dish
- `DELETE /api/dishes/:dishId` - Delete dish

### QR Codes
- `POST /api/restaurants/:restaurantId/qrcode` - Generate QR code
- `GET /api/restaurants/:restaurantId/qrcode` - Get QR code

### Public Menu
- `GET /menu/:slug` - View public menu

## Database Models

- **Tenant**: SaaS account with billing info
- **AdminUser**: Users with role-based permissions
- **Restaurant**: Restaurant profile
- **Category**: Menu categories
- **Dish**: Individual menu items
- **QRCode**: Generated QR codes
- **Analytics**: Event tracking

## Security

- JWT token validation on protected routes
- Tenant isolation middleware
- Password hashing with bcrypt
- CORS protection
- Helmet.js for security headers
- Rate limiting (recommended)
- HTTPS in production

## Deployment

The application is containerized with Docker and can be deployed to:
- Kubernetes (k8s/)
- AWS (Terraform configs in infra/)
- Any Docker-compatible platform

See `infra/deploy/` for deployment scripts.

## License

Proprietary - ShadabSDK
