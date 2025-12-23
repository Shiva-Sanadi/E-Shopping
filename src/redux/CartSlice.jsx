
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/api/cart');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (product, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/api/cart', {
        productId: product.id,
        quantity: 1
      });
      return { product, data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      await api.put(`/api/cart/${productId}`, { quantity });
      return { productId, quantity };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update cart');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/cart/${productId}`);
      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await api.delete('/api/cart');
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
    }
  }
);

const initialState = {
  products: [],
  totalQuantity: 0,
  totalPrice: 0,
  loading: false,
  error: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Local cart operations for non-authenticated users
    addToCartLocal(state, action) {
      const newItem = action.payload;
      const itemIndex = state.products.find(item => item.id === newItem.id);
      if (itemIndex) {
        itemIndex.totalQuantity++;
        itemIndex.totalPrice += newItem.price;
      } else {
        state.products.push({
          id: newItem.id,
          name: newItem.title,
          price: newItem.price,
          totalQuantity: 1,
          totalPrice: newItem.price,
          image: newItem.image
        });
      }
      state.totalQuantity++;
      state.totalPrice += newItem.price;
    },
    increaseQuantity(state, action) {
      const id = action.payload;
      const findItem = state.products.find(item => item.id === id);
      if (findItem) {
        findItem.totalQuantity++;
        findItem.totalPrice += findItem.price;
        state.totalQuantity++;
        state.totalPrice += findItem.price;
      }
    },
    decreaseQuantity(state, action) {
      const id = action.payload;
      const findItem = state.products.find(item => item.id === id);
      if (findItem && findItem.totalQuantity > 1) {
        findItem.totalQuantity--;
        findItem.totalPrice -= findItem.price;
        state.totalQuantity--;
        state.totalPrice -= findItem.price;
      }
    },
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalQuantity = action.payload.totalQuantity;
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        const product = action.payload.product;
        const existingItem = state.products.find(item => item.id === product.id);
        
        if (existingItem) {
          existingItem.totalQuantity++;
          existingItem.totalPrice += product.price;
        } else {
          state.products.push({
            id: product.id,
            name: product.title,
            price: product.price,
            totalQuantity: 1,
            totalPrice: product.price,
            image: product.image
          });
        }
        state.totalQuantity++;
        state.totalPrice += product.price;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update quantity
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        const { productId, quantity } = action.payload;
        const item = state.products.find(p => p.id === productId);
        if (item) {
          const diff = quantity - item.totalQuantity;
          item.totalQuantity = quantity;
          item.totalPrice = item.price * quantity;
          state.totalQuantity += diff;
          state.totalPrice += item.price * diff;
        }
      })
      // Remove from cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        const id = action.payload;
        const findItem = state.products.find(item => item.id === id);
        if (findItem) {
          state.totalPrice -= findItem.totalPrice;
          state.totalQuantity -= findItem.totalQuantity;
          state.products = state.products.filter(item => item.id !== id);
        }
      })
      // Clear cart
      .addCase(clearCart.fulfilled, (state) => {
        state.products = [];
        state.totalQuantity = 0;
        state.totalPrice = 0;
      });
  }
});

export const { addToCartLocal, increaseQuantity, decreaseQuantity, clearError } = cartSlice.actions;
export default cartSlice.reducer;