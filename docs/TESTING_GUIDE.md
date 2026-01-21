# Testing Guide

## Overview

Comprehensive testing strategy for the E-Shopping application covering unit tests, integration tests, and end-to-end tests.

## Backend Testing

### 1. Setup Testing Environment

```bash
cd backend

# Install test dependencies (if not already installed)
npm install --save-dev jest @types/jest supertest

# Create test configuration
cat > jest.config.js << 'EOF'
module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/config/**'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  verbose: true
};
EOF

# Create test setup
cat > jest.setup.js << 'EOF'
require('dotenv').config({ path: '.env.test' });
EOF
```

### 2. Unit Tests

Example test structure:

```javascript
// src/controllers/__tests__/authController.test.js
const { register, login } = require('../authController');
const { prisma } = require('../../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

describe('Auth Controller', () => {
  beforeEach(async () => {
    // Clear database before each test
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const req = {
        body: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'Password123!'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          token: expect.any(String)
        })
      );
    });

    it('should return error for duplicate email', async () => {
      // Create existing user
      await prisma.user.create({
        data: {
          name: 'Existing User',
          email: 'existing@example.com',
          password: await bcrypt.hash('Password123!', 10),
          role: 'USER'
        }
      });

      const req = {
        body: {
          name: 'New User',
          email: 'existing@example.com',
          password: 'Password123!'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Email already registered'
        })
      );
    });
  });
});
```

### 3. Integration Tests

```javascript
// src/routes/__tests__/authRoutes.test.js
const request = require('supertest');
const app = require('../../server');
const { prisma } = require('../../config/db');

describe('Auth Routes', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('should register and return token', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'Password123!'
        });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
    });

    it('should not register with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'invalid-email',
          password: 'Password123!'
        });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create test user
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'Password123!'
        });
    });

    it('should login with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!'
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should not login with wrong password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword'
        });

      expect(response.statusCode).toBe(401);
    });
  });
});
```

### 4. Run Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- authController.test.js

# Watch mode (re-run on file changes)
npm test -- --watch

# Run only failed tests
npm test -- --onlyChanged
```

## Frontend Testing

### 1. Setup Testing

```bash
cd frontend

# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Create vitest config
cat > vite.config.test.js << 'EOF'
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/__tests__/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/__tests__/'
      ]
    }
  }
});
EOF

# Create setup file
cat > src/__tests__/setup.js << 'EOF'
import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
EOF
```

### 2. Component Tests

```javascript
// src/__tests__/components/ProductCard.test.jsx
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from '../../Components/ProductCard';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import wishlistReducer from '../../redux/WishlistSlice';

describe('ProductCard Component', () => {
  const mockProduct = {
    id: 1,
    title: 'Test Product',
    price: 99.99,
    image: '/test.jpg',
    category: 'Electronics'
  };

  const renderComponent = (product = mockProduct) => {
    const store = configureStore({
      reducer: {
        wishlist: wishlistReducer
      }
    });

    return render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCard product={product} />
        </BrowserRouter>
      </Provider>
    );
  };

  it('renders product information', () => {
    renderComponent();
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('displays product image', () => {
    renderComponent();
    
    const image = screen.getByAltText(/test product/i);
    expect(image).toHaveAttribute('src', '/test.jpg');
  });

  it('has add to cart button', () => {
    renderComponent();
    
    const button = screen.getByRole('button', { name: /add to cart/i });
    expect(button).toBeInTheDocument();
  });
});
```

### 3. Redux Tests

```javascript
// src/__tests__/redux/CartSlice.test.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer, { 
  addToCart, 
  removeFromCart 
} from '../../redux/CartSlice';

describe('Cart Slice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        cart: cartReducer
      }
    });
  });

  it('should add item to cart', () => {
    const item = { id: 1, name: 'Product', price: 99.99, quantity: 1 };
    
    store.dispatch(addToCart(item));
    
    const state = store.getState().cart;
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual(item);
  });

  it('should remove item from cart', () => {
    const item = { id: 1, name: 'Product', price: 99.99, quantity: 1 };
    
    store.dispatch(addToCart(item));
    store.dispatch(removeFromCart(1));
    
    const state = store.getState().cart;
    expect(state.items).toHaveLength(0);
  });
});
```

### 4. Run Frontend Tests

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch

# Update snapshots
npm test -- --update
```

## E2E Testing

### Setup Playwright

```bash
npm install --save-dev @playwright/test

# Initialize Playwright
npx playwright install

# Create config
cat > playwright.config.js << 'EOF'
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
EOF
```

### E2E Test Example

```javascript
// e2e/auth.spec.js
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should register new user', async ({ page }) => {
    await page.goto('/register');
    
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'Password123!');
    
    await page.click('button:has-text("Register")');
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Welcome')).toBeVisible();
  });

  test('should login existing user', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Password123!');
    
    await page.click('button:has-text("Login")');
    
    await expect(page).toHaveURL('/dashboard');
  });
});
```

### Run E2E Tests

```bash
# Run all E2E tests
npx playwright test

# Run specific file
npx playwright test auth.spec.js

# Debug mode
npx playwright test --debug

# Headed mode (see browser)
npx playwright test --headed

# Generate report
npx playwright show-report
```

## CI/CD Integration

Tests run automatically on GitHub Actions (see `.github/workflows/`):

```bash
# Push to trigger CI
git push origin feature-branch

# Check status in GitHub Actions
# Visit: https://github.com/yourname/E-Shopping/actions
```

## Coverage Reports

```bash
# Backend coverage
npm test -- --coverage

# Frontend coverage
npm test -- --coverage

# Open HTML report
open coverage/lcov-report/index.html
```

## Testing Best Practices

1. **Unit Tests**: Test individual functions
2. **Integration Tests**: Test multiple components together
3. **E2E Tests**: Test complete user flows
4. **Coverage Target**: Aim for 70%+ coverage
5. **Isolation**: Each test should be independent
6. **Naming**: Use descriptive test names
7. **Mocking**: Mock external APIs and services
8. **Performance**: Keep tests fast (< 1s per test)

## Debugging Tests

```bash
# Backend
npm test -- --detectOpenHandles
npm test -- --forceExit

# Frontend
npm test -- --reporter=verbose

# E2E
npx playwright test --debug
```

---

For more details, check individual test files and CI/CD workflows!
