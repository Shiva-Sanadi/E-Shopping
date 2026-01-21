# API Documentation

## Base URL
- **Development:** `http://localhost:5000/api`
- **Production:** `https://api.e-shopping.com/api`

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### POST /auth/register
Register new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure_password"
}
```

### POST /auth/login
User login
```json
{
  "email": "john@example.com",
  "password": "secure_password"
}
```

### GET /auth/profile
Get current user profile (Protected)

---

## 👤 User Endpoints

### GET /user/profile (Protected)
Get user profile

### PUT /user/profile (Protected)
Update user profile

### POST /user/change-password (Protected)
Change user password

### GET /user/addresses (Protected)
Get all addresses

### POST /user/addresses (Protected)
Create new address

### PUT /user/addresses/:id (Protected)
Update address

### DELETE /user/addresses/:id (Protected)
Delete address

### PUT /user/addresses/:id/default (Protected)
Set address as default

---

## 🛍️ Product Endpoints

### GET /products
Get all products (pagination, filtering, sorting)

### GET /products/:id
Get product details

### GET /products/category/:categoryId
Get products by category

### POST /products/search
Search products

---

## 🛒 Cart Endpoints

### POST /cart (Protected)
Add to cart

### GET /cart (Protected)
Get cart items

### PUT /cart/:productId (Protected)
Update cart item quantity

### DELETE /cart/:productId (Protected)
Remove from cart

### DELETE /cart (Protected)
Clear cart

---

## 📦 Order Endpoints

### POST /orders (Protected)
Create new order

### GET /orders (Protected)
Get user orders

### GET /orders/:id (Protected)
Get order details

### PUT /orders/:id (Protected, Admin)
Update order status

---

## ↩️ Return Endpoints

### POST /returns (Protected)
Request return

### GET /returns (Protected)
Get user returns

### GET /returns/:id (Protected)
Get return details

### PUT /returns/:id (Protected, Admin)
Update return status

### POST /returns/:id/refund (Protected, Admin)
Process refund

---

## 🏷️ Coupon Endpoints

### GET /coupons
Get active coupons

### POST /coupons/validate
Validate coupon code

### GET /coupons (Admin)
Get all coupons

### POST /coupons (Admin)
Create coupon

### PUT /coupons/:id (Admin)
Update coupon

### DELETE /coupons/:id (Admin)
Delete coupon

---

## 📊 Admin Analytics Endpoints

### GET /admin/analytics (Admin)
Get analytics dashboard

### GET /admin/analytics/sales (Admin)
Get sales report by date range

### GET /admin/analytics/top-products (Admin)
Get top products

### GET /admin/analytics/order-status (Admin)
Get order status distribution

---

## ⚙️ Settings Endpoints

### GET /admin/settings (Admin)
Get admin settings

### PUT /admin/settings (Admin)
Update admin settings

---

## 🔔 Notification Endpoints

### GET /notifications (Protected)
Get user notifications

### POST /notifications/:id/read (Protected)
Mark notification as read

### POST /notifications/read-all (Protected)
Mark all as read

### DELETE /notifications/:id (Protected)
Delete notification

---

## 📍 Order Tracking Endpoints

### GET /orders/:orderNumber/track (Protected)
Track order status

### GET /orders/:orderNumber/timeline (Protected)
Get order timeline

---

## Response Format

### Success Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message",
  "errors": []
}
```

---

## Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## Rate Limiting
- 100 requests per 15 minutes per IP

---

## Pagination
Default limit: 10, max limit: 100
```
GET /products?page=1&limit=10
```
