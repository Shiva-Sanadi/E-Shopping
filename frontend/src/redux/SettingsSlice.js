import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../api/axios";

export const getSettings = createAsyncThunk(
  "settings/getSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/settings");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateSettings = createAsyncThunk(
  "settings/updateSettings",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.put("/api/settings", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getAnalytics = createAsyncThunk(
  "settings/getAnalytics",
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/settings/analytics", { params: { startDate, endDate } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getSalesReport = createAsyncThunk(
  "settings/getSalesReport",
  async ({ startDate, endDate, category }, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/settings/sales-report", { params: { startDate, endDate, category } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const SettingsSlice = createSlice({
  name: "settings",
  initialState: {
    settings: null,
    analytics: null,
    salesReport: null,
    loading: false,
    error: null,
    success: false
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload.settings;
      })
      .addCase(getSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.settings = action.payload.settings;
        state.success = true;
      })
      .addCase(getAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload.analytics;
      })
      .addCase(getSalesReport.fulfilled, (state, action) => {
        state.salesReport = action.payload.report;
      });
  }
});

export default SettingsSlice.reducer;
