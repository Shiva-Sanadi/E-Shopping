import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// Dashboard
export const fetchDashboardStats = createAsyncThunk(
  "admin/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/admin/dashboard");
      return response.data.stats;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch stats");
    }
  }
);

// Products
export const fetchAllProductsAdmin = createAsyncThunk(
  "admin/fetchAllProductsAdmin",
  async ({ page = 1, limit = 10, search = "" }, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/admin/products", {
        params: { page, limit, search }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
    }
  }
);

export const createProductAdmin = createAsyncThunk(
  "admin/createProductAdmin",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/admin/products", productData);
      return response.data.product;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create product");
    }
  }
);

export const updateProductAdmin = createAsyncThunk(
  "admin/updateProductAdmin",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/admin/products/${id}`, data);
      return response.data.product;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update product");
    }
  }
);

export const deleteProductAdmin = createAsyncThunk(
  "admin/deleteProductAdmin",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/admin/products/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete product");
    }
  }
);

// Users
export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async ({ page = 1, limit = 10, search = "" }, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/admin/users", {
        params: { page, limit, search }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch users");
    }
  }
);

export const updateUserRole = createAsyncThunk(
  "admin/updateUserRole",
  async ({ id, role }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/admin/users/${id}/role`, { role });
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update user role");
    }
  }
);

export const deleteUserAdmin = createAsyncThunk(
  "admin/deleteUserAdmin",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/admin/users/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete user");
    }
  }
);

// Orders
export const fetchAllOrders = createAsyncThunk(
  "admin/fetchAllOrders",
  async ({ page = 1, limit = 10, status = "all" }, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/admin/orders", {
        params: { page, limit, status }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
    }
  }
);

export const fetchOrderDetails = createAsyncThunk(
  "admin/fetchOrderDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/admin/orders/${id}`);
      return response.data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch order details");
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "admin/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/admin/orders/${id}/status`, { status });
      return response.data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update order status");
    }
  }
);

export const deleteOrderAdmin = createAsyncThunk(
  "admin/deleteOrderAdmin",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/admin/orders/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete order");
    }
  }
);

const AdminSlice = createSlice({
  name: "admin",
  initialState: {
    stats: null,
    products: [],
    users: [],
    orders: [],
    orderDetails: null,
    pagination: {},
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    // Dashboard
    builder.addCase(fetchDashboardStats.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchDashboardStats.fulfilled, (state, action) => {
      state.loading = false;
      state.stats = action.payload;
      state.success = true;
    });
    builder.addCase(fetchDashboardStats.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch Products
    builder.addCase(fetchAllProductsAdmin.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAllProductsAdmin.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload.products;
      state.pagination = action.payload.pagination;
    });
    builder.addCase(fetchAllProductsAdmin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Create Product
    builder.addCase(createProductAdmin.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createProductAdmin.fulfilled, (state, action) => {
      state.loading = false;
      state.products.unshift(action.payload);
      state.success = true;
    });
    builder.addCase(createProductAdmin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Update Product
    builder.addCase(updateProductAdmin.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateProductAdmin.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.products.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
      state.success = true;
    });
    builder.addCase(updateProductAdmin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Delete Product
    builder.addCase(deleteProductAdmin.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteProductAdmin.fulfilled, (state, action) => {
      state.loading = false;
      state.products = state.products.filter((p) => p.id !== action.payload);
      state.success = true;
    });
    builder.addCase(deleteProductAdmin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch Users
    builder.addCase(fetchAllUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAllUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload.users;
      state.pagination = action.payload.pagination;
    });
    builder.addCase(fetchAllUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Update User Role
    builder.addCase(updateUserRole.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateUserRole.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.users.findIndex((u) => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
      state.success = true;
    });
    builder.addCase(updateUserRole.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Delete User
    builder.addCase(deleteUserAdmin.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteUserAdmin.fulfilled, (state, action) => {
      state.loading = false;
      state.users = state.users.filter((u) => u.id !== action.payload);
      state.success = true;
    });
    builder.addCase(deleteUserAdmin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch Orders
    builder.addCase(fetchAllOrders.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAllOrders.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = action.payload.orders;
      state.pagination = action.payload.pagination;
    });
    builder.addCase(fetchAllOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch Order Details
    builder.addCase(fetchOrderDetails.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchOrderDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.orderDetails = action.payload;
    });
    builder.addCase(fetchOrderDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Update Order Status
    builder.addCase(updateOrderStatus.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateOrderStatus.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.orders.findIndex((o) => o.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
      state.orderDetails = action.payload;
      state.success = true;
    });
    builder.addCase(updateOrderStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Delete Order
    builder.addCase(deleteOrderAdmin.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteOrderAdmin.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = state.orders.filter((o) => o.id !== action.payload);
      state.success = true;
    });
    builder.addCase(deleteOrderAdmin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
});

export const { clearError, clearSuccess } = AdminSlice.actions;
export default AdminSlice.reducer;
