# Quick Admin Testing Guide

## Step 1: Create Admin User (via Database)

If you don't have an admin user, run this in your database:

```sql
INSERT INTO User (name, email, password, role, createdAt) 
VALUES (
  'Admin User',
  'admin@example.com',
  '$2a$10$your_hashed_password_here', -- hash "admin123" with bcryptjs
  'ADMIN',
  NOW()
);
```

Or use an existing user and update their role:
```sql
UPDATE User SET role = 'ADMIN' WHERE email = 'your_email@example.com';
```

## Step 2: Test Admin Login Flow

1. **Open Frontend**: `http://localhost:5173/#/login`
2. **Login with Admin Email**: `admin@example.com`
3. **Expected Result**: 
   - ✅ Automatically redirected to `http://localhost:5173/#/admin/dashboard`
   - ✅ See dashboard with stats cards
   - ✅ "Admin Panel" link visible in navbar

## Step 3: Test Add Product

1. **From Admin Dashboard**:
   - Click "Products" in left sidebar
   - Click "Add Product" button (blue button)
   - Modal opens with professional form
   
2. **Fill Form**:
   - Title: "Test Product"
   - Price: "99.99"
   - Stock: "50"
   - Category: "electronics"
   - Description: "Test description"
   - Image: Upload an image (or paste URL)
   
3. **Expected Result**:
   - ✅ Form submits
   - ✅ Modal closes
   - ✅ Product appears in list
   - ✅ Success message shown

## Step 4: Test Regular User Login

1. **Login with Regular User**: `user@example.com`
2. **Expected Result**:
   - ✅ Redirected to home page `/`
   - ✅ "Admin Panel" link NOT visible in navbar
   - ✅ Can still access products, cart, checkout normally

## Step 5: Test Admin Navigation

1. **From Dashboard**:
   - Click "Users" → See users list with role management
   - Click "Orders" → See all orders with status updates
   - Click "Products" → Manage all products
   - Click "Dashboard" → Back to stats view

2. **From Navbar**:
   - Click "Admin Panel" link → Returns to dashboard
   - Navigate to shop → "Admin Panel" link still visible
   - Click logo → If admin, goes to dashboard; if user, goes to home

---

## Troubleshooting

### Problem: Still redirects to home after admin login
**Solution**: 
- Check user role in database: `SELECT role FROM User WHERE email='admin@example.com';`
- Ensure role is exactly "ADMIN" (case-sensitive)

### Problem: "Add Product" modal not opening
**Solution**:
- Check console for errors
- Make sure you're on `/admin/products` page
- Try refreshing the page

### Problem: Product not appearing after add
**Solution**:
- Check backend console for errors
- Verify token is being sent (check Network tab)
- Check that all required fields are filled

### Problem: Navbar "Admin Panel" link not showing
**Solution**:
- Clear localStorage: `localStorage.clear()` in console
- Refresh page
- Login again with admin account

---

## File Changes Made

✅ `frontend/src/Components/Navbar.jsx` - Removed AddProduct, added Admin Panel link
✅ `frontend/src/Components/Login.jsx` - Added admin redirect logic
✅ `frontend/src/Components/AddProduct.jsx` - Added onSuccess callback
✅ `frontend/src/App.jsx` - Added home page redirect for admins
✅ `frontend/src/pages/AdminProducts.jsx` - Integrated AddProduct modal

All backend admin routes are ready and working! 🚀
