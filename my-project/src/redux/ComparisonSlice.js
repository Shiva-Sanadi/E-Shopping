// ComparisonSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  maxCompare: 4,
};

const comparisonSlice = createSlice({
  name: "comparison",
  initialState,
  reducers: {
    addToComparison(state, action) {
      const product = action.payload;
      if (state.products.length < state.maxCompare) {
        const exists = state.products.find((p) => p.id === product.id);
        if (!exists) {
          state.products.push(product);
        }
      }
    },
    removeFromComparison(state, action) {
      state.products = state.products.filter((p) => p.id !== action.payload);
    },
    clearComparison(state) {
      state.products = [];
    },
  },
});

export const { addToComparison, removeFromComparison, clearComparison } = comparisonSlice.actions;
export default comparisonSlice.reducer;
