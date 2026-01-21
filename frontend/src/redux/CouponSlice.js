import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../api/axios";

export const fetchCoupons = createAsyncThunk(
  "coupon/fetchCoupons",
  async ({ page = 1, limit = 10, search = "" }, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/coupons", {
        params: { page, limit, search }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createCoupon = createAsyncThunk(
  "coupon/createCoupon",
  async (couponData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/coupons", couponData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCoupon = createAsyncThunk(
  "coupon/updateCoupon",
  async ({ id, ...data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/coupons/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteCoupon = createAsyncThunk(
  "coupon/deleteCoupon",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/coupons/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const validateCoupon = createAsyncThunk(
  "coupon/validateCoupon",
  async ({ code, orderTotal }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/coupons/validate", { code, orderTotal });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const CouponSlice = createSlice({
  name: "coupon",
  initialState: {
    coupons: [],
    loading: false,
    error: null,
    success: false,
    pagination: { page: 1, limit: 10, total: 0 },
    validatedCoupon: null
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload.coupons;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch coupons";
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.success = true;
        state.coupons.unshift(action.payload.coupon);
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        state.success = true;
        state.coupons = state.coupons.map(c => c.id === action.payload.coupon.id ? action.payload.coupon : c);
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.success = true;
        state.coupons = state.coupons.filter(c => c.id !== action.meta.arg);
      })
      .addCase(validateCoupon.fulfilled, (state, action) => {
        state.validatedCoupon = action.payload.coupon;
        state.error = null;
      })
      .addCase(validateCoupon.rejected, (state, action) => {
        state.error = action.payload?.message || "Invalid coupon";
        state.validatedCoupon = null;
      });
  }
});

export default CouponSlice.reducer;
