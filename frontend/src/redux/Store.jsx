
import { configureStore } from '@reduxjs/toolkit';
import CartSlice from "./CartSlice";
import ProductSlice from "./ProductSlice";
import WishlistSlice from "./WishlistSlice";
import ComparisonSlice from "./ComparisonSlice";
import ReviewSlice from "./ReviewSlice";
import AuthSlice from "./AuthSlice";
import AdminSlice from "./AdminSlice";
import NotificationSlice from "./NotificationSlice";
import CouponSlice from "./CouponSlice";
import UserProfileSlice from "./UserProfileSlice";
import ReturnSlice from "./ReturnSlice";
import SettingsSlice from "./SettingsSlice";

const store = configureStore({
    reducer: {
        auth: AuthSlice,
        cart: CartSlice,
        product: ProductSlice,
        wishlist: WishlistSlice,
        comparison: ComparisonSlice,
        reviews: ReviewSlice,
        admin: AdminSlice,
        notification: NotificationSlice,
        coupon: CouponSlice,
        userProfile: UserProfileSlice,
        return: ReturnSlice,
        settings: SettingsSlice,
    }
});

export default store;