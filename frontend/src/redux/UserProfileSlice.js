import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../api/axios";

export const getUserProfile = createAsyncThunk(
  "userProfile/getUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/user/profile");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "userProfile/updateUserProfile",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.put("/api/user/profile", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const changePassword = createAsyncThunk(
  "userProfile/changePassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.put("/api/user/change-password", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getAllAddresses = createAsyncThunk(
  "userProfile/getAllAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/user/addresses");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addAddress = createAsyncThunk(
  "userProfile/addAddress",
  async (addressData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/user/addresses", addressData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateAddress = createAsyncThunk(
  "userProfile/updateAddress",
  async ({ id, ...data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/user/addresses/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "userProfile/deleteAddress",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/user/addresses/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const setDefaultAddress = createAsyncThunk(
  "userProfile/setDefaultAddress",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/user/addresses/${id}/default`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const UserProfileSlice = createSlice({
  name: "userProfile",
  initialState: {
    user: null,
    addresses: [],
    loading: false,
    error: null,
    success: false
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.success = true;
        state.user = action.payload.user;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.success = true;
      })
      .addCase(getAllAddresses.fulfilled, (state, action) => {
        state.addresses = action.payload.addresses;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addresses.push(action.payload.address);
        state.success = true;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.map(a => a.id === action.payload.address.id ? action.payload.address : a);
        state.success = true;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter(a => a.id !== action.meta.arg);
        state.success = true;
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.map(a => ({...a, isDefault: a.id === action.payload.address.id}));
      });
  }
});

export default UserProfileSlice.reducer;
