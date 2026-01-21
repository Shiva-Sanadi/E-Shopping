import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../api/axios";

export const createReturn = createAsyncThunk(
  "return/createReturn",
  async (returnData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/returns", returnData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getUserReturns = createAsyncThunk(
  "return/getUserReturns",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/returns", { params: { page, limit } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getReturnDetails = createAsyncThunk(
  "return/getReturnDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/returns/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getAllReturns = createAsyncThunk(
  "return/getAllReturns",
  async ({ page = 1, limit = 10, status = "all" }, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/returns/admin/all", { params: { page, limit, status } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateReturnStatus = createAsyncThunk(
  "return/updateReturnStatus",
  async ({ id, status, notes }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/returns/${id}/status`, { status, notes });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const processRefund = createAsyncThunk(
  "return/processRefund",
  async ({ id, notes }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/returns/${id}/refund`, { notes });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const ReturnSlice = createSlice({
  name: "return",
  initialState: {
    returns: [],
    selectedReturn: null,
    loading: false,
    error: null,
    success: false,
    pagination: { page: 1, limit: 10, total: 0 }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createReturn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReturn.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createReturn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(getUserReturns.fulfilled, (state, action) => {
        state.returns = action.payload.returns;
        state.pagination = action.payload.pagination;
      })
      .addCase(getReturnDetails.fulfilled, (state, action) => {
        state.selectedReturn = action.payload.return;
      })
      .addCase(getAllReturns.fulfilled, (state, action) => {
        state.returns = action.payload.returns;
        state.pagination = action.payload.pagination;
      })
      .addCase(updateReturnStatus.fulfilled, (state, action) => {
        state.success = true;
        state.returns = state.returns.map(r => r.id === action.payload.return.id ? action.payload.return : r);
      })
      .addCase(processRefund.fulfilled, (state, action) => {
        state.success = true;
        state.returns = state.returns.map(r => r.id === action.payload.return.id ? action.payload.return : r);
      });
  }
});

export default ReturnSlice.reducer;
