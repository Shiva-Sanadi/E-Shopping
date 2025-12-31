
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// Async thunks
export const fetchProductReviews = createAsyncThunk(
  'reviews/fetchProductReviews',
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/reviews/product/${productId}`);
      return { productId, reviews: data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

export const addReview = createAsyncThunk(
  'reviews/addReview',
  async ({ productId, review }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/api/reviews', {
        productId,
        ...review
      });
      return { productId, review: data.review };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add review');
    }
  }
);

export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ productId, reviewId, updatedReview }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/api/reviews/${reviewId}`, updatedReview);
      return { productId, review: data.review };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update review');
    }
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async ({ productId, reviewId }, { rejectWithValue }) => {
    try {
      await api.delete(`/api/reviews/${reviewId}`);
      return { productId, reviewId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete review');
    }
  }
);

const initialState = {
  reviews: {},
  loading: false,
  error: null
};

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch reviews
      .addCase(fetchProductReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        const { productId, reviews } = action.payload;
        state.reviews[productId] = reviews;
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add review
      .addCase(addReview.fulfilled, (state, action) => {
        const { productId, review } = action.payload;
        if (!state.reviews[productId]) {
          state.reviews[productId] = [];
        }
        state.reviews[productId].unshift(review);
      })
      // Update review
      .addCase(updateReview.fulfilled, (state, action) => {
        const { productId, review } = action.payload;
        const reviews = state.reviews[productId];
        if (reviews) {
          const index = reviews.findIndex((r) => r.id === review.id);
          if (index !== -1) {
            reviews[index] = review;
          }
        }
      })
      // Delete review
      .addCase(deleteReview.fulfilled, (state, action) => {
        const { productId, reviewId } = action.payload;
        if (state.reviews[productId]) {
          state.reviews[productId] = state.reviews[productId].filter(
            (r) => r.id !== reviewId
          );
        }
      });
  }
});

export const { clearError } = reviewSlice.actions;
export default reviewSlice.reducer;