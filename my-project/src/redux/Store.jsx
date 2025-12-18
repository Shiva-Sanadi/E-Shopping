// redux/store.js - Updated store with all new slices
import { configureStore } from '@reduxjs/toolkit';
import CartSlice from "./CartSlice";
import ProductSlice from "./ProductSlice";
import WishlistSlice from "./WishlistSlice";
import ComparisonSlice from "./ComparisonSlice";
import ReviewSlice from "./ReviewSlice";

const store = configureStore({
    reducer: {
        cart: CartSlice,
        product: ProductSlice,
        wishlist: WishlistSlice,
        comparison: ComparisonSlice,
        reviews: ReviewSlice,
    }
});

export default store;