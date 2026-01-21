# Project Architecture

## 🏗️ System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    E-Shopping Platform                       │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
        ┌───────▼────────┐         ┌────────▼───────┐
        │   Frontend      │         │    Backend     │
        │   (React)       │◄────────►    (Express)   │
        └────────────────┘         └────────────────┘
                │                           │
                │                           │
        ┌───────▼────────┐         ┌────────▼───────┐
        │ Redux Store    │         │  Database      │
        │ State Mgmt     │         │  (MySQL)       │
        └────────────────┘         └────────────────┘
```

---

## 🔄 Data Flow

### Request Flow
```
Frontend Component
        ↓
Redux Action (Thunk)
        ↓
Axios Request
        ↓
API Endpoint
        ↓
Route Handler
        ↓
Controller Logic
        ↓
Database Query (Prisma)
        ↓
Response
        ↓
Redux State Update
        ↓
Component Re-render
```

### User Authentication Flow
```
Login Form
    ↓
POST /auth/login
    ↓
Verify Credentials
    ↓
Generate JWT Token
    ↓
Store Token (localStorage)
    ↓
Add Token to Axios Headers (Interceptor)
    ↓
Protected Route Access
```

---

## 📦 Frontend Architecture

### Component Hierarchy
```
App
├── Navbar
├── Routes
│   ├── Home
│   ├── Shop
│   │   └── ProductCard (reusable)
│   ├── ProductDetail
│   ├── Cart
│   ├── Checkout
│   ├── UserProfile (Protected)
│   │   ├── AddressManagement
│   │   ├── OrderHistory
│   │   └── Settings
│   ├── AdminDashboard (Admin)
│   │   ├── AdminProducts
│   │   ├── AdminOrders
│   │   ├── AdminCoupons
│   │   ├── AdminAnalytics
│   │   └── AdminSettings
│   └── Auth
│       ├── Login
│       └── Register
└── Footer
```

### State Management (Redux)
```
Store
├── auth (login, user, token)
├── product (products, filters, selected)
├── cart (items, total, quantity)
├── order (orders, current)
├── wishlist (items)
├── comparison (products)
├── review (reviews, ratings)
├── user (profile, addresses)
├── coupon (coupons, applied)
├── return (returns, status)
├── notification (notifications, unread)
└── admin (analytics, settings)
```

### API Integration Layer
```
components/
    ↓
actions (Redux Thunks)
    ↓
api/axios (HTTP Client)
    ↓
API Interceptors (Auth, Error)
    ↓
Backend Endpoints
```

---

## 🗄️ Backend Architecture

### Layer Structure
```
Controllers (Business Logic)
        ↓
Services (Reusable Logic)
        ↓
Database Layer (Prisma ORM)
        ↓
MySQL Database
```

### Request Handling Flow
```
Request
    ↓
Middleware (Auth, Validation)
    ↓
Route Handler
    ↓
Controller
    ↓
Service/Utility
    ↓
Prisma Query
    ↓
Database
    ↓
Response Formatter
    ↓
Send Response
```

### Authentication Middleware
```
JWT Token (from header)
    ↓
Verify Token
    ↓
Extract User ID
    ↓
Attach to Request
    ↓
Next Middleware/Controller
```

### Authorization Check
```
Is Authenticated?
    ├── No → 401 Unauthorized
    └── Yes → Check Role?
        ├── ADMIN → Allow
        ├── USER → Deny (403 Forbidden)
        └── Public → Allow
```

---

## 🗄️ Database Schema

### Key Entities
```
User
├── id (PK)
├── name
├── email (Unique)
├── password (hashed)
├── role (USER/ADMIN)
└── Relations
    ├── addresses[]
    ├── cartItems[]
    ├── wishlist[]
    ├── orders[]
    └── reviews[]

Product
├── id (PK)
├── title
├── price
├── stock
├── image
└── Relations
    ├── cartItems[]
    ├── wishlist[]
    ├── orderItems[]
    └── reviews[]

Order
├── id (PK)
├── orderNumber (Unique)
├── userId (FK)
├── totalPrice
├── status (PENDING/COMPLETED)
└── Relations
    ├── user
    ├── items[]
    └── returns[]

Address
├── id (PK)
├── userId (FK)
├── address
├── city
├── zip
└── isDefault

Coupon
├── id (PK)
├── code (Unique)
├── discountType (PERCENTAGE/FIXED)
├── discountValue
├── expiryDate
└── usageCount

Return
├── id (PK)
├── userId (FK)
├── orderId (FK)
├── reason
├── status (REQUESTED/APPROVED/REFUNDED)
└── refundAmount

Notification
├── id (PK)
├── userId (FK)
├── type (ORDER/RETURN/PROMO)
├── title
├── message
└── isRead
```

---

## 🔐 Security Architecture

### Password Security
```
User Input Password
    ↓
Hash with bcryptjs (10 rounds)
    ↓
Store Hashed Password
    ↓
On Login: Compare Hash
```

### JWT Token Flow
```
Generate Token (user.id + role)
    ↓
Include in Response
    ↓
Store in localStorage
    ↓
Include in Every Request
    ↓
Verify Signature
    ↓
Extract User Info
```

### CORS Configuration
```
Frontend: http://localhost:5173
    ↓
Backend CORS Middleware
    ↓
Allow specified origins
    ↓
Allow methods: GET, POST, PUT, DELETE
    ↓
Allow credentials (cookies, tokens)
```

---

## 🔄 API Communication

### Request Format
```
POST /api/orders
Content-Type: application/json
Authorization: Bearer <token>

{
  "items": [{ "productId": 1, "quantity": 2 }],
  "shippingAddress": "123 Main St"
}
```

### Response Format
```
{
  "success": true,
  "statusCode": 201,
  "message": "Order created successfully",
  "data": {
    "id": 1,
    "orderNumber": "ORD-001",
    "status": "PENDING"
  }
}
```

### Error Response
```
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Invalid email" }
  ]
}
```

---

## 📊 Performance Considerations

### Frontend Optimization
- Code splitting per route
- Lazy loading components
- Redux selectors for memoization
- Image optimization
- Debounced searches

### Backend Optimization
- Database indexing (email, userId)
- Query optimization with Prisma select/include
- Pagination for large datasets
- Caching strategies
- Rate limiting

### Caching Strategy
```
Browser Cache
    ↓
Redux Store
    ↓
LocalStorage (auth token)
    ↓
Axios Cache Headers
```

---

## 🚀 Deployment Architecture

### Development Environment
```
Local Machine
├── Backend (npm run dev)
├── Frontend (npm run dev)
└── MySQL (local instance)
```

### Production Environment
```
Docker Container (Backend)
    ↓
Reverse Proxy (Nginx)
    ↓
CDN (Static Assets)
    ↓
RDS/Cloud Database
```

---

## 📈 Scalability Plan

### Phase 1: Current
- Monorepo structure
- Single backend server
- Shared database

### Phase 2: Growth
- Separate repositories
- Multiple backend instances
- Database replication

### Phase 3: Scale
- Microservices architecture
- API Gateway
- Message Queue (for notifications)
- Caching layer (Redis)
- Search engine (Elasticsearch)

---

## 🧪 Testing Architecture

### Unit Tests
```
Components
    ↓
Utility Functions
    ↓
Redux Reducers
```

### Integration Tests
```
API Endpoints
    ↓
Database Operations
    ↓
Business Logic
```

### E2E Tests
```
User Flows
    ↓
Complete Scenarios
    ↓
Cross-browser Testing
```

---

## 📝 Monitoring & Logging

### Application Logs
- Request/Response logging
- Error logging with stack traces
- Performance metrics
- Database query logging

### Monitoring Tools
- Error tracking (Sentry)
- Performance monitoring (New Relic)
- Log aggregation (ELK Stack)
- APM (Application Performance Monitoring)

---

## 🔄 CI/CD Pipeline

```
Code Push
    ↓
Run Tests
    ↓
Code Quality Check
    ↓
Build Application
    ↓
Deploy to Staging
    ↓
Integration Tests
    ↓
Deploy to Production
    ↓
Smoke Tests
```
