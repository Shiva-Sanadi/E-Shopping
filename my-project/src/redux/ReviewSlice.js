// ReviewSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reviews: {}, // Format: { productId: [reviews] }
};

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    addReview(state, action) {
      const { productId, review } = action.payload;
      if (!state.reviews[productId]) {
        state.reviews[productId] = [];
      }
      state.reviews[productId].unshift({
        ...review,
        id: Date.now(),
        date: new Date().toISOString(),
      });
    },
    updateReview(state, action) {
      const { productId, reviewId, updatedReview } = action.payload;
      const reviews = state.reviews[productId];
      if (reviews) {
        const index = reviews.findIndex((r) => r.id === reviewId);
        if (index !== -1) {
          reviews[index] = { ...reviews[index], ...updatedReview };
        }
      }
    },
    deleteReview(state, action) {
      const { productId, reviewId } = action.payload;
      if (state.reviews[productId]) {
        state.reviews[productId] = state.reviews[productId].filter(
          (r) => r.id !== reviewId
        );
      }
    },
  },
});

export const { addReview, updateReview, deleteReview } = reviewSlice.actions;
export default reviewSlice.reducer;