
import { configureStore } from '@reduxjs/toolkit';
import CartSlice from "./CartSlice";
import ProductSlice from "./ProductSlice";
import WishlistSlice from "./WishlistSlice";
import ComparisonSlice from "./ComparisonSlice";
import ReviewSlice from "./ReviewSlice";
import AuthSlice from "./AuthSlice";

const store = configureStore({
    reducer: {
        auth: AuthSlice,
        cart: CartSlice,
        product: ProductSlice,
        wishlist: WishlistSlice,
        comparison: ComparisonSlice,
        reviews: ReviewSlice,
    }
});

export default store;