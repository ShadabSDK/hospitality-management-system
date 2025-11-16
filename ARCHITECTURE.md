# System Architecture & Design Document
## Restaurant Digital Menu SaaS Platform

**Version:** 1.0  
**Date:** 2024  
**Status:** MVP Architecture  
**Author:** Solution Architect

---

## 📑 Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Architecture](#2-system-architecture)
3. [Component Architecture](#3-component-architecture)
4. [Data Architecture](#4-data-architecture)
5. [API Architecture](#5-api-architecture)
6. [Security Architecture](#6-security-architecture)
7. [Deployment Architecture](#7-deployment-architecture)
8. [Key Design Patterns](#8-key-design-patterns)
9. [Technology Stack](#9-technology-stack)
10. [Scalability & Performance](#10-scalability--performance)

---

## 1. Executive Summary

This document describes the architecture for a **multi-tenant SaaS platform** that enables restaurants to manage digital menus. The system follows industry best practices while maintaining simplicity for MVP delivery.

### Architecture Principles
- **Multi-tenant SaaS** with shared database model
- **RESTful API** design with JWT authentication
- **Microservices-ready** but monolithic for MVP
- **Cloud-native** deployment (Docker, managed services)
- **Security-first** approach with tenant isolation
- **Scalable** foundation for future growth

---

## 2. System Architecture

### 2.1 High-Level System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        FA[Flutter Admin App]
        CB[Customer Browser]
    end
    
    subgraph "API Gateway / Load Balancer"
        LB[Load Balancer]
    end
    
    subgraph "Application Layer"
        API[Node.js Backend API]
        AUTH[Auth Service]
        MENU[Menu Service]
        BILL[Billing Service]
    end
    
    subgraph "Data Layer"
        DB[(MongoDB Atlas)]
        REDIS[(Redis Cache)]
        S3[(AWS S3)]
    end
    
    subgraph "External Services"
        STRIPE[Stripe API]
        CDN[Cloudflare CDN]
    end
    
    FA -->|HTTPS/JWT| LB
    CB -->|HTTPS| LB
    LB --> API
    API --> AUTH
    API --> MENU
    API --> BILL
    
    AUTH --> DB
    MENU --> DB
    MENU --> REDIS
    MENU --> S3
    BILL --> STRIPE
    
    S3 --> CDN
    CDN --> CB
    
    style FA fill:#4A90E2
    style CB fill:#4A90E2
    style API fill:#50C878
    style DB fill:#FF6B6B
    style REDIS fill:#FF6B6B
    style S3 fill:#FF6B6B
    style STRIPE fill:#FFA500
```

### 2.2 Request Flow Architecture

```mermaid
sequenceDiagram
    participant Client
    participant LB as Load Balancer
    participant API as Node.js API
    participant MW as Middleware Layer
    participant Service as Business Service
    participant DB as MongoDB
    participant Cache as Redis
    participant S3 as AWS S3
    
    Client->>LB: HTTP Request
    LB->>API: Route Request
    API->>MW: Authentication
    MW->>MW: Tenant Isolation
    MW->>MW: Rate Limiting
    MW->>Service: Authorized Request
    Service->>Cache: Check Cache
    alt Cache Hit
        Cache-->>Service: Cached Data
    else Cache Miss
        Service->>DB: Query Data
        DB-->>Service: Data
        Service->>Cache: Store in Cache
    end
    Service->>S3: Get Image (if needed)
    S3-->>Service: Image URL
    Service-->>API: Response
    API-->>LB: HTTP Response
    LB-->>Client: HTTP Response
```

---

## 3. Component Architecture

### 3.1 Backend Component Structure

```mermaid
graph LR
    subgraph "API Layer"
        ROUTES[Routes]
        CONTROLLERS[Controllers]
    end
    
    subgraph "Business Logic Layer"
        AUTH_SVC[Auth Service]
        TENANT_SVC[Tenant Service]
        MENU_SVC[Menu Service]
        QR_SVC[QR Service]
        ANALYTICS_SVC[Analytics Service]
        UPLOAD_SVC[Upload Service]
        BILLING_SVC[Billing Service]
    end
    
    subgraph "Data Access Layer"
        MODELS[Models/Schemas]
        REPOS[Repositories]
    end
    
    subgraph "Infrastructure Layer"
        MIDDLEWARE[Middleware]
        UTILS[Utilities]
        CONFIG[Configuration]
    end
    
    ROUTES --> CONTROLLERS
    CONTROLLERS --> AUTH_SVC
    CONTROLLERS --> TENANT_SVC
    CONTROLLERS --> MENU_SVC
    CONTROLLERS --> QR_SVC
    CONTROLLERS --> ANALYTICS_SVC
    CONTROLLERS --> UPLOAD_SVC
    CONTROLLERS --> BILLING_SVC
    
    AUTH_SVC --> MODELS
    TENANT_SVC --> MODELS
    MENU_SVC --> MODELS
    QR_SVC --> MODELS
    ANALYTICS_SVC --> MODELS
    BILLING_SVC --> MODELS
    
    MODELS --> REPOS
    REPOS --> DB[(MongoDB)]
    
    MIDDLEWARE --> CONTROLLERS
    UTILS --> AUTH_SVC
    UTILS --> MENU_SVC
    CONFIG --> MIDDLEWARE
```

### 3.2 Detailed Component Responsibilities

| Component | Responsibility |
|-----------|---------------|
| **Routes** | Define API endpoints, HTTP methods |
| **Controllers** | Handle HTTP requests/responses, validation |
| **Services** | Business logic, orchestration |
| **Models** | Data schemas, validation rules |
| **Repositories** | Database operations, queries |
| **Middleware** | Auth, tenant isolation, rate limiting, logging |
| **Utils** | Helpers, formatters, validators |

---

## 4. Data Architecture

### 4.1 Multi-Tenant Data Model

```mermaid
erDiagram
    TENANT ||--o{ ADMINUSER : has
    TENANT ||--o{ RESTAURANT : owns
    RESTAURANT ||--o{ CATEGORY : contains
    CATEGORY ||--o{ DISH : has
    RESTAURANT ||--|| QRCODE : generates
    RESTAURANT ||--o{ ANALYTICS : tracks
    
    TENANT {
        ObjectId _id PK
        string name
        string plan
        string stripeCustomerId
        date trialEndsAt
        date createdAt
        date updatedAt
    }
    
    ADMINUSER {
        ObjectId _id PK
        ObjectId tenantId FK
        string email UK
        string passwordHash
        string role
        date createdAt
    }
    
    RESTAURANT {
        ObjectId _id PK
        ObjectId tenantId FK
        string name
        string slug UK
        string description
        string logoUrl
        date createdAt
        date updatedAt
    }
    
    CATEGORY {
        ObjectId _id PK
        ObjectId restaurantId FK
        ObjectId tenantId FK
        string name
        number displayOrder
        date createdAt
    }
    
    DISH {
        ObjectId _id PK
        ObjectId restaurantId FK
        ObjectId categoryId FK
        ObjectId tenantId FK
        string name
        string description
        number price
        string imageUrl
        boolean isAvailable
        number displayOrder
        date createdAt
        date updatedAt
    }
    
    QRCODE {
        ObjectId _id PK
        ObjectId restaurantId FK
        ObjectId tenantId FK
        string url
        string qrImageUrl
        date createdAt
    }
    
    ANALYTICS {
        ObjectId _id PK
        ObjectId tenantId FK
        ObjectId restaurantId FK
        string eventType
        object metadata
        date createdAt
    }
```

### 4.2 Database Indexing Strategy

```javascript
// Critical Indexes for Performance
tenants: []
adminUsers: [
  { email: 1 }, // unique
  { tenantId: 1 }
]
restaurants: [
  { slug: 1 }, // unique
  { tenantId: 1 }
]
categories: [
  { restaurantId: 1, displayOrder: 1 },
  { tenantId: 1 }
]
dishes: [
  { restaurantId: 1, categoryId: 1, displayOrder: 1 },
  { tenantId: 1 },
  { isAvailable: 1 }
]
qrCodes: [
  { restaurantId: 1 },
  { tenantId: 1 }
]
analytics: [
  { tenantId: 1, createdAt: -1 },
  { restaurantId: 1, eventType: 1, createdAt: -1 }
]
```

### 4.3 Data Isolation Strategy

**Tenant Isolation Pattern:**
- All queries MUST include `tenantId` filter
- Middleware enforces tenant context from JWT
- No cross-tenant data access possible
- Indexes on `tenantId` for performance

---

## 5. API Architecture

### 5.1 API Design Principles

- **RESTful** conventions
- **Versioned** APIs (`/api/v1/...`)
- **Consistent** response format
- **Error handling** standards
- **Rate limiting** per tenant

### 5.2 API Endpoint Structure

```mermaid
graph TB
    subgraph "Public APIs"
        MENU_PUBLIC[GET /menu/:slug]
        MENU_API[GET /api/v1/menu/:slug]
    end
    
    subgraph "Authentication APIs"
        REGISTER[POST /api/v1/auth/register]
        LOGIN[POST /api/v1/auth/login]
        ME[GET /api/v1/auth/me]
        REFRESH[POST /api/v1/auth/refresh]
    end
    
    subgraph "Restaurant APIs"
        GET_REST[GET /api/v1/restaurants/:id]
        UPDATE_REST[PUT /api/v1/restaurants/:id]
    end
    
    subgraph "Menu Management APIs"
        CREATE_CAT[POST /api/v1/restaurants/:id/categories]
        LIST_CAT[GET /api/v1/restaurants/:id/categories]
        UPDATE_CAT[PUT /api/v1/categories/:id]
        DELETE_CAT[DELETE /api/v1/categories/:id]
        
        CREATE_DISH[POST /api/v1/restaurants/:id/dishes]
        UPDATE_DISH[PUT /api/v1/dishes/:id]
        DELETE_DISH[DELETE /api/v1/dishes/:id]
    end
    
    subgraph "QR Code APIs"
        GENERATE_QR[POST /api/v1/restaurants/:id/qrcode]
        GET_QR[GET /api/v1/restaurants/:id/qrcode]
    end
    
    subgraph "Upload APIs"
        PRESIGNED[POST /api/v1/upload/presigned-url]
    end
    
    subgraph "Analytics APIs"
        GET_ANALYTICS[GET /api/v1/restaurants/:id/analytics]
    end
    
    subgraph "Billing APIs"
        GET_BILLING[GET /api/v1/billing]
        PORTAL[POST /api/v1/billing/portal]
    end
```

### 5.3 API Response Format

```json
// Success Response
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [ ... ]
  }
}
```

---

## 6. Security Architecture

### 6.1 Security Layers

```mermaid
graph TB
    subgraph "Network Security"
        HTTPS[HTTPS/TLS]
        WAF[Web Application Firewall]
    end
    
    subgraph "Application Security"
        JWT[JWT Authentication]
        RBAC[Role-Based Access Control]
        TI[Tenant Isolation]
        RL[Rate Limiting]
        VAL[Input Validation]
    end
    
    subgraph "Data Security"
        ENC[Encryption at Rest]
        TRANS[Encryption in Transit]
        S3_SIG[S3 Signed URLs]
    end
    
    HTTPS --> WAF
    WAF --> JWT
    JWT --> RBAC
    RBAC --> TI
    TI --> RL
    RL --> VAL
    VAL --> ENC
    ENC --> TRANS
    TRANS --> S3_SIG
```

### 6.2 Authentication Flow

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant AuthService
    participant DB
    participant Redis
    
    Client->>API: POST /auth/login
    API->>AuthService: Validate Credentials
    AuthService->>DB: Find User by Email
    DB-->>AuthService: User Data
    AuthService->>AuthService: Verify Password
    AuthService->>AuthService: Generate JWT
    AuthService->>Redis: Store Refresh Token
    AuthService-->>API: Access Token + Refresh Token
    API-->>Client: JWT Tokens
    
    Note over Client,Redis: Subsequent Requests
    Client->>API: Request with JWT
    API->>API: Verify JWT
    API->>API: Extract tenantId
    API->>API: Enforce Tenant Isolation
    API-->>Client: Response
```

### 6.3 Tenant Isolation Enforcement

```mermaid
flowchart TD
    REQ[Incoming Request] --> JWT{Extract JWT}
    JWT --> VERIFY{Verify JWT}
    VERIFY -->|Invalid| REJECT[401 Unauthorized]
    VERIFY -->|Valid| EXTRACT[Extract tenantId]
    EXTRACT --> CONTEXT[Set Tenant Context]
    CONTEXT --> QUERY[Database Query]
    QUERY --> FILTER[Add tenantId Filter]
    FILTER --> EXECUTE[Execute Query]
    EXECUTE --> VALIDATE{Result tenantId<br/>matches JWT?}
    VALIDATE -->|No| REJECT2[403 Forbidden]
    VALIDATE -->|Yes| ALLOW[Return Data]
```

---

## 7. Deployment Architecture

### 7.1 Infrastructure Architecture

```mermaid
graph TB
    subgraph "CDN Layer"
        CF[Cloudflare CDN]
    end
    
    subgraph "Application Layer"
        LB[Application Load Balancer]
        APP1[Node.js Container 1]
        APP2[Node.js Container 2]
        APP3[Node.js Container N]
    end
    
    subgraph "Data Layer"
        MONGO[(MongoDB Atlas<br/>Primary + Replicas)]
        REDIS_CLUSTER[(Redis Cluster)]
        S3_BUCKET[(S3 Bucket)]
    end
    
    subgraph "External Services"
        STRIPE_API[Stripe API]
    end
    
    CF --> LB
    LB --> APP1
    LB --> APP2
    LB --> APP3
    
    APP1 --> MONGO
    APP2 --> MONGO
    APP3 --> MONGO
    
    APP1 --> REDIS_CLUSTER
    APP2 --> REDIS_CLUSTER
    APP3 --> REDIS_CLUSTER
    
    APP1 --> S3_BUCKET
    APP2 --> S3_BUCKET
    APP3 --> S3_BUCKET
    
    APP1 --> STRIPE_API
    APP2 --> STRIPE_API
    APP3 --> STRIPE_API
    
    S3_BUCKET --> CF
```

### 7.2 Container Architecture

```mermaid
graph LR
    subgraph "Docker Container"
        NODE[Node.js Runtime]
        APP[Application Code]
        DEPS[Dependencies]
    end
    
    subgraph "Orchestration"
        DOCKER_COMPOSE[Docker Compose<br/>Dev/Staging]
        K8S[Kubernetes<br/>Production]
    end
    
    NODE --> APP
    APP --> DEPS
    DOCKER_COMPOSE --> NODE
    K8S --> NODE
```

---

## 8. Key Design Patterns

### 8.1 Service Layer Pattern

**Purpose:** Separate business logic from controllers

```javascript
// Controller (Thin)
class DishController {
  async create(req, res) {
    const dish = await dishService.create(req.body, req.tenantId);
    res.json({ success: true, data: dish });
  }
}

// Service (Business Logic)
class DishService {
  async create(data, tenantId) {
    // Validation
    // Business rules
    // Database operations
    // Return result
  }
}
```

### 8.2 Repository Pattern

**Purpose:** Abstract database operations

```javascript
class DishRepository {
  async findByRestaurant(restaurantId, tenantId) {
    return Dish.find({ restaurantId, tenantId });
  }
}
```

### 8.3 Middleware Chain Pattern

**Purpose:** Compose cross-cutting concerns

```javascript
app.use(authenticationMiddleware);
app.use(tenantIsolationMiddleware);
app.use(rateLimitMiddleware);
app.use(validationMiddleware);
```

### 8.4 Feature Flag Pattern

**Purpose:** Plan-based feature access

```javascript
function checkFeature(plan, feature) {
  const planFeatures = PLAN_FEATURES[plan];
  return planFeatures.includes(feature);
}
```

---

## 9. Technology Stack

### 9.1 Backend Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Runtime** | Node.js 18+ | JavaScript runtime |
| **Framework** | Express.js | Web framework |
| **Database** | MongoDB 6+ | Document database |
| **ODM** | Mongoose | MongoDB object modeling |
| **Cache** | Redis 7+ | Caching layer |
| **Storage** | AWS S3 | Image storage |
| **Authentication** | JWT (jsonwebtoken) | Token-based auth |
| **Validation** | Joi/Zod | Input validation |
| **Logging** | Winston/Pino | Application logging |
| **Testing** | Jest | Unit/integration tests |

### 9.2 Frontend Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Mobile App** | Flutter | Cross-platform admin app |
| **State Management** | Provider/Riverpod | State management |
| **HTTP Client** | Dio/HTTP | API communication |
| **Storage** | SharedPreferences | Local storage |

### 9.3 Infrastructure Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Containerization** | Docker | Application containers |
| **Orchestration** | Docker Compose / K8s | Container orchestration |
| **Database** | MongoDB Atlas | Managed MongoDB |
| **Cache** | Redis Cloud / ElastiCache | Managed Redis |
| **CDN** | Cloudflare | Content delivery |
| **Monitoring** | CloudWatch / DataDog | Application monitoring |
| **CI/CD** | GitHub Actions | Continuous integration |

---

## 10. Scalability & Performance

### 10.1 Caching Strategy

```mermaid
graph LR
    REQ[Request] --> CACHE{Redis Cache}
    CACHE -->|Hit| RETURN[Return Cached Data]
    CACHE -->|Miss| DB[(MongoDB)]
    DB --> STORE[Store in Cache]
    STORE --> RETURN
    
    style CACHE fill:#FF6B6B
    style DB fill:#4A90E2
```

**Cache Keys:**
- Menu data: `menu:{slug}`
- Restaurant: `restaurant:{id}`
- Tenant: `tenant:{id}`

**TTL Strategy:**
- Menu pages: 1 hour (invalidate on update)
- Restaurant data: 30 minutes
- Tenant data: 15 minutes

### 10.2 Performance Optimizations

1. **Database Indexing**
   - All `tenantId` fields indexed
   - Compound indexes for common queries
   - Unique indexes on slugs, emails

2. **Query Optimization**
   - Limit result sets (pagination)
   - Project only needed fields
   - Use aggregation pipelines efficiently

3. **Image Optimization**
   - CDN delivery
   - Multiple sizes (thumbnail, medium, large)
   - WebP format support

4. **API Response Optimization**
   - Gzip compression
   - Response caching headers
   - Pagination for lists

### 10.3 Scalability Plan

**Phase 1 (MVP):**
- Single Node.js instance
- MongoDB Atlas (shared cluster)
- Redis single instance
- Basic monitoring

**Phase 2 (Growth):**
- Horizontal scaling (multiple Node.js instances)
- MongoDB read replicas
- Redis cluster
- Advanced monitoring & alerting

**Phase 3 (Scale):**
- Microservices architecture (if needed)
- Database sharding
- Event-driven architecture
- Advanced analytics pipeline

---

## 11. Key Flows

### 11.1 Tenant Registration Flow

```mermaid
sequenceDiagram
    participant User
    participant API
    participant AuthService
    participant TenantService
    participant Stripe
    participant DB
    
    User->>API: POST /auth/register
    API->>AuthService: Validate Input
    AuthService->>DB: Check Email Exists
    DB-->>AuthService: Not Found
    AuthService->>TenantService: Create Tenant
    TenantService->>DB: Create Tenant Record
    TenantService->>DB: Create Restaurant Record
    TenantService->>Stripe: Create Customer
    Stripe-->>TenantService: Customer ID
    TenantService->>DB: Update Tenant with Stripe ID
    TenantService->>AuthService: Create Admin User
    AuthService->>DB: Create User Record
    AuthService->>AuthService: Generate JWT
    AuthService-->>API: Tokens + Tenant Data
    API-->>User: 201 Created + JWT
```

### 11.2 Image Upload Flow

```mermaid
sequenceDiagram
    participant Flutter
    participant API
    participant UploadService
    participant S3
    
    Flutter->>API: POST /upload/presigned-url
    API->>UploadService: Generate Presigned URL
    UploadService->>S3: Generate Presigned URL
    S3-->>UploadService: Presigned URL + File URL
    UploadService-->>API: URLs
    API-->>Flutter: Presigned URL + File URL
    
    Flutter->>S3: PUT Image (Direct Upload)
    S3-->>Flutter: 200 OK
    
    Flutter->>API: POST /dishes (with imageUrl)
    API-->>Flutter: 201 Created
```

### 11.3 Menu View Flow

```mermaid
sequenceDiagram
    participant Customer
    participant CDN
    participant API
    participant Cache
    participant DB
    participant Analytics
    
    Customer->>CDN: GET /menu/:slug
    CDN->>API: Cache Miss - Fetch from API
    API->>Cache: Check Redis Cache
    Cache-->>API: Cache Miss
    API->>DB: Fetch Restaurant + Menu Data
    DB-->>API: Menu Data
    API->>Cache: Store in Redis (TTL: 1hr)
    API->>Analytics: Log Menu View
    API->>API: Render HTML (EJS)
    API-->>CDN: HTML Response
    CDN->>CDN: Cache HTML
    CDN-->>Customer: HTML Menu Page
```

---

## 12. Monitoring & Observability

### 12.1 Key Metrics

- **Application Metrics:**
  - Request rate (RPS)
  - Response time (p50, p95, p99)
  - Error rate
  - Active tenants

- **Database Metrics:**
  - Query performance
  - Connection pool usage
  - Index hit rate

- **Infrastructure Metrics:**
  - CPU/Memory usage
  - Network I/O
  - Disk usage

### 12.2 Logging Strategy

- **Structured Logging:** JSON format
- **Log Levels:** Error, Warn, Info, Debug
- **Log Aggregation:** Centralized logging service
- **Retention:** 30 days

---

## 13. Disaster Recovery

### 13.1 Backup Strategy

- **Database:** MongoDB Atlas automated backups (daily)
- **S3:** Versioning enabled
- **Configuration:** Version controlled in Git

### 13.2 Recovery Procedures

- **RTO (Recovery Time Objective):** < 4 hours
- **RPO (Recovery Point Objective):** < 24 hours
- **Failover:** Manual with automated scripts

---

## 14. Conclusion

This architecture provides a **solid, scalable foundation** for the MVP while maintaining simplicity and avoiding over-engineering. The design follows industry best practices and can evolve as the platform grows.

### Key Strengths
- ✅ Clear separation of concerns
- ✅ Multi-tenant security
- ✅ Scalable infrastructure
- ✅ Industry-standard patterns
- ✅ MVP-focused (not over-engineered)

### Future Enhancements
- Microservices migration (if needed)
- Real-time features (WebSockets)
- Advanced analytics (time-series DB)
- Event-driven architecture
- GraphQL API (optional)

---

**Document Status:** ✅ Approved for Implementation  
**Last Updated:** 2024

