# 🛍️ E-Shopping Platform

A full-stack e-commerce application built with modern web technologies. Features comprehensive product catalog, shopping cart, order management, admin dashboard, and advanced features like coupons, returns, and analytics.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18+-blue)
![MySQL](https://img.shields.io/badge/MySQL-8+-orange)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

### 👥 User Features
- ✅ User authentication with JWT
- ✅ Complete user profile management
- ✅ Multiple address management
- ✅ Product browsing and search
- ✅ Shopping cart management
- ✅ Order placement and tracking
- ✅ Order history with detailed views
- ✅ Product wishlists
- ✅ Product comparison
- ✅ Product reviews and ratings
- ✅ Return requests and refunds
- ✅ Notification system
- ✅ Real-time order tracking
- ✅ Coupon application

### 🔧 Admin Features
- ✅ Product management (CRUD)
- ✅ Order management and tracking
- ✅ User management
- ✅ Coupon management
- ✅ Advanced analytics dashboard
- ✅ Sales reports by date range
- ✅ Return request handling
- ✅ Business settings configuration
- ✅ Order status distribution insights

### 🛠️ Technical Features
- ✅ Responsive design (mobile-first)
- ✅ Dark/Light theme support
- ✅ Real-time notifications
- ✅ Protected routes with role-based access
- ✅ Advanced search with filters
- ✅ Pagination support
- ✅ Data visualization with charts
- ✅ Secure password handling
- ✅ CORS enabled
- ✅ Error handling & validation

---

## 🏗️ Architecture

```
┌──────────────┐          ┌──────────────┐
│   Frontend   │◄────────►│   Backend    │
│   (React)    │ HTTP/JWT │  (Express)   │
└──────────────┘          └──────────────┘
      │                           │
      │                    ┌──────▼──────┐
      │                    │   MySQL     │
      │                    │  Database   │
      │                    └─────────────┘
      │
   Redux Store
   (State Mgmt)
```

See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for detailed system design.

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- MySQL 8+
- npm or yarn

### Installation

#### 1. Clone Repository
```bash
git clone https://github.com/yourusername/e-shopping.git
cd e-shopping
```

#### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database URL

# Run migrations
npx prisma migrate dev

# Start server
npm run dev
```
**Backend:** `http://localhost:5000`

#### 3. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Start development server
npm run dev
```
**Frontend:** `http://localhost:5173`

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [SETUP_GUIDE.md](./docs/SETUP_GUIDE.md) | Installation & configuration guide |
| [API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md) | Complete API endpoints reference |
| [ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System design and architecture |
| [CONTRIBUTING.md](./docs/CONTRIBUTING.md) | How to contribute to the project |
| [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) | Folder structure overview |

---

## 📁 Folder Structure

```
E-Shopping/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── controllers/    # Business logic
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   ├── utils/          # Helper functions
│   │   └── server.js       # App entry point
│   └── prisma/             # Database schema & migrations
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route pages
│   │   ├── redux/         # State management
│   │   ├── api/           # API integration
│   │   ├── utils/         # Helper functions
│   │   └── App.jsx        # Root component
│   └── public/            # Static assets
├── docs/                  # Project documentation
└── scripts/               # Build & deployment scripts
```

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for complete structure.

---

## 🔑 Default Credentials (Development)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | admin123 |
| User | user@example.com | user123 |

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Redux Toolkit** - State management
- **React Router v7** - Routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **Prisma** - ORM
- **MySQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **CORS** - Cross-origin requests

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Container orchestration
- **GitHub Actions** - CI/CD pipeline
- **Nginx** - Reverse proxy

---

## 📊 API Overview

### Authentication
```http
POST /api/auth/register
POST /api/auth/login
GET /api/auth/profile (Protected)
```

### Products
```http
GET /api/products
GET /api/products/:id
POST /api/products (Admin)
PUT /api/products/:id (Admin)
DELETE /api/products/:id (Admin)
```

### Orders
```http
POST /api/orders (Protected)
GET /api/orders (Protected)
GET /api/orders/:id (Protected)
PUT /api/orders/:id (Admin)
```

### Admin
```http
GET /api/admin/analytics (Admin)
GET /api/admin/coupons (Admin)
GET /api/admin/settings (Admin)
```

See [API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md) for full endpoints.

---

## 🧪 Testing

### Run Tests
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# Coverage report
npm run test:coverage
```

---

## 🐳 Docker Setup

### Build and Run
```bash
# Build images
docker-compose build

# Run containers
docker-compose up

# Run in background
docker-compose up -d
```

### Access Services
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- MySQL: `localhost:3306`

---

## 📦 Build for Production

### Frontend Build
```bash
cd frontend
npm run build
# Output: dist/
```

### Backend Build
```bash
cd backend
npm run build
npm start
```

---

## 🔐 Security Features

✅ **Password Security**
- Bcryptjs hashing (10 rounds)
- Password strength validation

✅ **Authentication**
- JWT token-based auth
- Token expiration & refresh
- Secure token storage

✅ **Authorization**
- Role-based access control (RBAC)
- Protected API endpoints
- Admin-only routes

✅ **Input Validation**
- Form validation
- API input sanitization
- SQL injection prevention

✅ **Communication**
- HTTPS ready
- CORS configuration
- XSS prevention

---

## 📈 Performance

- ✅ Code splitting
- ✅ Lazy loading
- ✅ Image optimization
- ✅ Database indexing
- ✅ Query optimization
- ✅ Caching strategies
- ✅ Pagination support
- ✅ Redux memoization

---

## 🚦 CI/CD Pipeline

```
Code Push
    ↓
Run Tests
    ↓
Code Quality Check
    ↓
Build
    ↓
Deploy to Staging
    ↓
Deploy to Production
```

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for guidelines.

### Quick Start
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📞 Support

- 📖 Check [documentation](./docs/)
- 🔍 Search [existing issues](https://github.com/yourusername/e-shopping/issues)
- 💬 Create [new issue](https://github.com/yourusername/e-shopping/issues/new)

---

## 📝 License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with ❤️ by the development team
- Thanks to all contributors
- Icons from React Icons
- Charts from Recharts

---

## 🗺️ Roadmap

### Phase 1 (Current) ✅
- Core e-commerce features
- User authentication
- Admin dashboard
- Order management

### Phase 2 (Planned)
- Payment gateway integration
- Email notifications
- Advanced search with Elasticsearch
- Wishlist sharing
- Social features

### Phase 3 (Future)
- Mobile app
- AI-powered recommendations
- Inventory management
- Multi-vendor support
- International shipping

---

## 📊 Stats

- **Total Features:** 25+
- **API Endpoints:** 50+
- **Components:** 30+
- **Redux Slices:** 12+
- **Database Models:** 8+
- **Lines of Code:** 10,000+

---

**Happy Shopping! 🛒**

---

<div align="center">
  
  Made with ❤️ by [Your Name/Team]
  
  ⭐ Star this repo if you like it!
  
</div>
