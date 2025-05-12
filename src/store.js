import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './Slices/CartSlice';
import userReducer from './Slices/UserSlice';

export default configureStore({
    reducer: {
        cart: cartReducer,
        user: userReducer
    }
});