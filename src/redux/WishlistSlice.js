
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// --- Async Thunks ---

// Fetch wishlist items
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/wishlist");
      return data.items;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch wishlist");
    }
  }
);

// Add product to wishlist
export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (product, { rejectWithValue }) => {
    try {
      await api.post("/api/wishlist", { productId: product.id });
      return product; // return product to add to local state
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add to wishlist");
    }
  }
);

// Remove product from wishlist
export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/wishlist/${productId}`);
      return productId; // return id to remove from local state
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to remove from wishlist");
    }
  }
);

// Clear entire wishlist
export const clearWishlist = createAsyncThunk(
  "wishlist/clearWishlist",
  async (_, { rejectWithValue }) => {
    try {
      await api.delete("/api/wishlist");
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to clear wishlist");
    }
  }
);

// --- Slice ---

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add to wishlist
      .addCase(addToWishlist.fulfilled, (state, action) => {
        const exists = state.items.find((i) => i.id === action.payload.id);
        if (!exists) {
          state.items.push(action.payload); // only add if not already present
        }
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Remove from wishlist
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Clear wishlist
      .addCase(clearWishlist.fulfilled, (state) => {
        state.items = [];
      })
      .addCase(clearWishlist.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError } = wishlistSlice.actions;
export default wishlistSlice.reducer;
