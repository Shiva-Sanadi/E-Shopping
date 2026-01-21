# Setup & Installation Guide

## 📋 Prerequisites

- **Node.js** v16 or higher
- **npm** or **yarn** package manager
- **MySQL** database
- **Git** version control

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/e-shopping.git
cd e-shopping
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure database URL in .env
# DATABASE_URL="mysql://user:password@localhost:3306/eshopping"

# Run database migrations
npx prisma migrate dev

# Seed initial data (optional)
npm run seed

# Start backend server
npm run dev
```

Backend runs on: `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure API URL in .env
# VITE_API_URL="http://localhost:5000/api"

# Start development server
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## 📁 Project Structure

```
E-Shopping/
├── backend/          # Express.js API server
├── frontend/         # React.js with Vite
├── docs/            # Project documentation
└── scripts/         # Build & deployment scripts
```

---

## 🗄️ Database Setup

### MySQL Connection
1. Install MySQL if not already installed
2. Create database:
```sql
CREATE DATABASE eshopping;
```

### Environment Variables (.env)
```
DATABASE_URL="mysql://user:password@localhost:3306/eshopping"
JWT_SECRET="your_jwt_secret_key"
JWT_EXPIRE="7d"
PORT=5000
```

### Migrations
```bash
# Run migrations
npx prisma migrate dev

# Reset database (caution!)
npx prisma migrate reset
```

---

## 🔧 Environment Variables

### Backend (.env)
```
# Database
DATABASE_URL="mysql://..."

# JWT
JWT_SECRET="your_secret_key"
JWT_EXPIRE="7d"

# Server
PORT=5000
NODE_ENV=development

# Email (optional)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your_email@gmail.com"
EMAIL_PASS="your_password"

# File Upload
MAX_FILE_SIZE=5242880  # 5MB
```

### Frontend (.env)
```
# API
VITE_API_URL="http://localhost:5000/api"

# Other config
VITE_APP_NAME="E-Shopping"
VITE_APP_VERSION="1.0.0"
```

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

---

## 🏗️ Build for Production

### Backend Build
```bash
cd backend
npm run build
npm start
```

### Frontend Build
```bash
cd frontend
npm run build
# Output in dist/ folder
```

---

## 🐳 Docker Setup (Optional)

### Build and Run with Docker
```bash
# Build images
docker-compose build

# Run containers
docker-compose up

# Run in background
docker-compose up -d
```

### Access Services
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`
- MySQL: `localhost:3306`

---

## 📦 Dependencies

### Backend
- express - Web framework
- prisma - ORM
- jsonwebtoken - JWT authentication
- bcryptjs - Password hashing
- dotenv - Environment variables
- cors - CORS handling
- multer - File uploads
- recharts - Data visualization

### Frontend
- react - UI library
- vite - Build tool
- redux-toolkit - State management
- react-router-dom - Routing
- axios - HTTP client
- tailwindcss - CSS framework
- recharts - Charts library

---

## 🔑 Default Credentials (Development)

**Admin Account:**
- Email: admin@example.com
- Password: admin123

**Test User:**
- Email: user@example.com
- Password: user123

---

## 🐛 Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306

Solution: Ensure MySQL is running
```

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

### Missing Dependencies
```bash
npm install
npm ci  # For exact versions
```

### Environment Variables Not Loading
- Ensure .env file exists
- Check .env is not in .gitignore
- Restart dev server

---

## 📚 Additional Resources

- [Backend README](../backend/README.md)
- [Frontend README](../frontend/README.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Architecture Guide](./ARCHITECTURE.md)

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Commit with clear messages
4. Push to GitHub
5. Create Pull Request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

---

## 📝 License

This project is licensed under MIT License - see [LICENSE](../LICENSE) file.

---

## 📞 Support

For issues and questions:
1. Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. Search existing GitHub issues
3. Create new issue with detailed description
