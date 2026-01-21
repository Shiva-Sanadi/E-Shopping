# E-Shopping Codebase Guide for AI Agents

## Architecture Overview

**Full-stack e-commerce application**: React + Redux frontend (Vite) with Express + Prisma MySQL backend.

- **Backend** (`/backend`): Node.js/Express REST API with Prisma ORM, MySQL database
- **Frontend** (`/frontend`): React 18 with Redux Toolkit for state management, Vite build tool
- **Communication**: Axios HTTP client with JWT token interceptors; Socket.IO partially set up for real-time features
- **Authentication**: JWT-based (Bearer tokens in Authorization header), role-based access (USER/ADMIN)

## Database Schema & Key Models

**Prisma MySQL schema** (`backend/prisma/schema.prisma`):

- **User**: id, name, email (unique), password, role (USER/ADMIN), createdAt
  - Relations: addresses, cartItems, wishlist, orders, reviews
- **Product**: id, title, description, price (Decimal 10,2), stock, category, image, categoryId, createdAt
  - Relations: cartItems, wishlist, orderItems, reviews
- **Order**: id, orderNumber (unique), userId, totalPrice, shippingAddress/City/Zip, paymentMethod, status (PENDING/COMPLETED)
  - Relations: orderItems, user
- **CartItem**: userId + productId (unique constraint); relations cascade-delete on user/product
- **Wishlist**: userId + productId (unique constraint); cascade-delete on relations
- **Review**: userId, productId, rating, comment; relations to User and Product

**Critical Pattern**: Use `select` and `include` to control returned fields; leverage cascade-delete constraints.

## Backend Development

### Routes & Controllers

**Entry point**: `backend/src/server.js` - Express app with CORS configured for `http://localhost:5173` (frontend).

**Route structure** (`backend/src/routes/`):
- `/auth`: register, login, getProfile (protect + admin checks)
- `/api/products`: getAllProducts (with filtering: category, price range, sort), getProductById, etc.
- `/api/cart`: addToCart, removeFromCart, updateQuantity
- `/api/orders`: createOrder, getOrders, getOrderById
- `/api/wishlist`: addToWishlist, removeFromWishlist
- `/api/reviews`: addReview, getReviews
- Static file serving: `/uploads` for product images

**Controllers** (`backend/src/controllers/`): Business logic per resource. Example pattern from `authController.js`:
```javascript
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};
// In register/login: hash password with bcryptjs, return token + user object
```

### Middleware

**authMiddleware.js**: `protect` middleware extracts Bearer token, verifies JWT, sets `req.user`. `admin` middleware checks role.
- Usage: `router.get("/protected", protect, handler)` or `protect, admin, handler`

### Database & Prisma

**Config**: `backend/src/config/db.js` exports `{ prisma, connectDB }`
- Prisma client created with logging enabled for errors/warnings
- `.env` file required: `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRE`, `PORT`

**Migrations**: `backend/prisma/migrations/` tracks schema changes
- Run: `npx prisma migrate dev --name <name>` locally; `npx prisma migrate deploy` in production
- Seed script: `backend/prisma/seed.js` for initial data

### Development Workflow

**Commands**:
- `npm start` - production server
- `npm run dev` - nodemon watch on `src/` (hot reload on .js/.ts changes)
- No test suite configured yet

## Frontend Development

### Redux Store & State Management

**Store** (`frontend/src/redux/Store.jsx`): configureStore with reducers:
- `auth`: authentication state (user, token, login status)
- `cart`: cart items and totals
- `product`: product list, filters, current product
- `wishlist`: saved products
- `comparison`: compare features across products
- `reviews`: product reviews

**Pattern**: Each slice in own file (e.g., `CartSlice.jsx`), export default reducer, use `createSlice` from Redux Toolkit.

### API Integration

**Axios setup** (`frontend/src/api/axios.js`):
- Base URL from `VITE_API_URL` env variable
- **Request interceptor**: auto-adds Bearer token from localStorage
- **Response interceptor**: on 401, clears token & redirects to `/login`
- Always use this instance, not raw axios

### Component Organization

- **Pages** (`frontend/src/pages/`): route-level components (Home, Cart, Order, etc.)
- **Components** (`frontend/src/Components/`): reusable UI (Navbar, ProductCard, Modal, etc.)
- **Styling**: Tailwind CSS + custom `theme.js` utilities
- **Assets**: Images in `frontend/src/assets/Images/`

### Build & Deployment

**Commands**:
- `npm run dev` - local Vite dev server (port 5173 by default)
- `npm run build` - production build to `dist/`
- `npm run deploy` - GitHub Pages deployment (uses `gh-pages` package)
- `npm run lint` - ESLint check (no auto-fix in default config)

**Build config**: `frontend/vite.config.js`, `postcss.config.js`, `tailwind.config.js`

## Cross-Component Communication Patterns

### Frontend → Backend Flow
1. Component dispatches Redux action
2. Thunk or direct axios call via `frontend/src/api/axios.js`
3. Bearer token auto-injected by request interceptor
4. Backend validates token via `protect` middleware
5. Controller returns `{ success: true, data: ... }` or error object

### Error Handling Convention
- Backend: 400 (validation), 401 (auth), 403 (unauthorized), 500 (server error)
- Frontend: Response interceptor catches 401 and redirects; components should display errors from redux state

### Real-Time Features (In Progress)
- Socket.IO partially wired (`frontend/src/Websocket.js` connects to backend)
- Backend has socket routes setup ready (not fully implemented in controllers yet)

## Project-Specific Conventions

### Code Style
- **Backend**: CommonJS (`require/module.exports`), ES5+ syntax, single line error handling with try-catch
- **Frontend**: ES6 modules, JSX, arrow functions, const-first declarations
- **No test suite** yet; focus is on feature development

### Security Notes
- Passwords: hashed with bcryptjs (10 rounds)
- JWT: stored in localStorage (frontend), verified on every protected request
- Roles: register defaults to USER; only explicit ADMIN role assignment (see `authController.js`)
- CORS: configured for localhost:5173; update origin in production

### Database Query Patterns
```javascript
// ✓ Use select for specific fields
await prisma.user.findUnique({ where: { email }, select: { id: true, name: true } })

// ✓ Use include for relations
await prisma.product.findMany({ include: { reviews: { select: { rating: true } } } })

// ✓ Calculate derived fields (e.g., avgRating) after fetch, not in DB
```

### File Upload
- Multer configured in backend (`package.json` has `multer` v2.0.2)
- Uploaded files served via `app.use('/uploads', express.static('uploads'))`
- Image paths stored in Product.image field

## Common Development Tasks

| Task | Command/File |
|------|--------------|
| Add new API endpoint | Create route in `backend/src/routes/` + controller in `backend/src/controllers/` |
| Add new Redux slice | Create file in `frontend/src/redux/` using Redux Toolkit `createSlice` |
| Database schema change | Edit `backend/prisma/schema.prisma`, run `npx prisma migrate dev` |
| Protect route (requires auth) | Use `protect` middleware from `authMiddleware.js` |
| Admin-only endpoint | Chain `protect, admin` middlewares |
| Add form validation | Implement in controller before DB operation (see authController pattern) |
| Style component | Use Tailwind classes; reference `frontend/src/utils/theme.js` for custom theme values |

## Important Files to Know

- **Database**: `backend/prisma/schema.prisma`
- **Server setup**: `backend/src/server.js`
- **Frontend store**: `frontend/src/redux/Store.jsx`
- **API client**: `frontend/src/api/axios.js`
- **Auth logic**: `backend/src/controllers/authController.js`, `backend/src/middleware/authMiddleware.js`
- **Product logic**: `backend/src/controllers/productController.js`
