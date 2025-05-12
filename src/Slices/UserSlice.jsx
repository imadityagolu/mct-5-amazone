import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doc, setDoc, getDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';

const initialState = {
    cart: [],
    total: 0,
    totalItems: 0,
    cartStatus: 'idle',
    cartError: null,
    wishlist: [],
    wishlistStatus: 'idle',
    wishlistError: null
};

// Async thunk to add item to cart
export const addToCartAsync = createAsyncThunk(
    'user/addToCart',
    async (product, { rejectWithValue }) => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('User not authenticated');
            
            const cartRef = doc(db, `users/${user.uid}/cart`, String(product.id));
            const cartSnap = await getDoc(cartRef);
            
            if (cartSnap.exists()) {
                const currentData = cartSnap.data();
                await setDoc(cartRef, {
                    ...currentData,
                    quantity: currentData.quantity + 1
                }, { merge: true });
                return { ...currentData, quantity: currentData.quantity + 1 };
            } else {
                const newItem = { ...product, quantity: 1 };
                await setDoc(cartRef, newItem);
                return newItem;
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk to fetch cart
export const fetchCartAsync = createAsyncThunk(
    'user/fetchCart',
    async (_, { rejectWithValue }) => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('User not authenticated');
            
            const cartCollection = collection(db, `users/${user.uid}/cart`);
            const cartSnapshot = await getDocs(cartCollection);
            const cartItems = cartSnapshot.docs.map(doc => ({ ...doc.data() }));
            return cartItems;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk to remove item from cart
export const removeFromCartAsync = createAsyncThunk(
    'user/removeFromCart',
    async (productId, { rejectWithValue }) => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('User not authenticated');
            
            const cartRef = doc(db, `users/${user.uid}/cart`, String(productId));
            await deleteDoc(cartRef);
            return productId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk to update cart quantity
export const updateQuantityAsync = createAsyncThunk(
    'user/updateQuantity',
    async ({ productId, quantity }, { rejectWithValue }) => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('User not authenticated');
            
            const cartRef = doc(db, `users/${user.uid}/cart`, String(productId));
            const cartSnap = await getDoc(cartRef);
            
            if (cartSnap.exists()) {
                const currentData = cartSnap.data();
                if (quantity <= 0) {
                    await deleteDoc(cartRef);
                    return { productId, quantity: 0 };
                } else {
                    await setDoc(cartRef, { ...currentData, quantity }, { merge: true });
                    return { productId, quantity };
                }
            }
            throw new Error('Item not found');
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk to add item to wishlist
export const addToWishlistAsync = createAsyncThunk(
    'user/addToWishlist',
    async (product, { rejectWithValue }) => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('User not authenticated');
            
            const wishlistRef = doc(db, `users/${user.uid}/wishlist`, String(product.id));
            const wishlistSnap = await getDoc(wishlistRef);
            
            if (wishlistSnap.exists()) {
                throw new Error('Item already in wishlist');
            }
            
            const newItem = { ...product };
            await setDoc(wishlistRef, newItem);
            return newItem;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk to fetch wishlist
export const fetchWishlistAsync = createAsyncThunk(
    'user/fetchWishlist',
    async (_, { rejectWithValue }) => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('User not authenticated');
            
            const wishlistCollection = collection(db, `users/${user.uid}/wishlist`);
            const wishlistSnapshot = await getDocs(wishlistCollection);
            const wishlistItems = wishlistSnapshot.docs.map(doc => ({ ...doc.data() }));
            return wishlistItems;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk to remove item from wishlist
export const removeFromWishlistAsync = createAsyncThunk(
    'user/removeFromWishlist',
    async (productId, { rejectWithValue }) => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('User not authenticated');
            
            const wishlistRef = doc(db, `users/${user.uid}/wishlist`, String(productId));
            await deleteDoc(wishlistRef);
            return productId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        resetCart: (state) => {
            state.cart = [];
            state.total = 0;
            state.totalItems = 0;
        },
        resetWishlist: (state) => {
            state.wishlist = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Cart reducers
            .addCase(addToCartAsync.fulfilled, (state, action) => {
                const item = action.payload;
                const existingItem = state.cart.find(i => i.id === item.id);
                if (existingItem) {
                    existingItem.quantity = item.quantity;
                } else {
                    state.cart.push(item);
                }
                state.total = state.cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
                state.totalItems = state.cart.reduce((sum, i) => sum + i.quantity, 0);
                state.cartStatus = 'succeeded';
            })
            .addCase(fetchCartAsync.fulfilled, (state, action) => {
                state.cart = action.payload;
                state.total = state.cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
                state.totalItems = state.cart.reduce((sum, i) => sum + i.quantity, 0);
                state.cartStatus = 'succeeded';
            })
            .addCase(removeFromCartAsync.fulfilled, (state, action) => {
                state.cart = state.cart.filter(i => i.id !== action.payload);
                state.total = state.cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
                state.totalItems = state.cart.reduce((sum, i) => sum + i.quantity, 0);
                state.cartStatus = 'succeeded';
            })
            .addCase(updateQuantityAsync.fulfilled, (state, action) => {
                const { productId, quantity } = action.payload;
                if (quantity === 0) {
                    state.cart = state.cart.filter(i => i.id !== productId);
                } else {
                    const item = state.cart.find(i => i.id === productId);
                    if (item) item.quantity = quantity;
                }
                state.total = state.cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
                state.totalItems = state.cart.reduce((sum, i) => sum + i.quantity, 0);
                state.cartStatus = 'succeeded';
            })
            .addCase(addToCartAsync.rejected, (state, action) => {
                state.cartStatus = 'failed';
                state.cartError = action.payload;
            })
            .addCase(fetchCartAsync.rejected, (state, action) => {
                state.cartStatus = 'failed';
                state.cartError = action.payload;
            })
            .addCase(removeFromCartAsync.rejected, (state, action) => {
                state.cartStatus = 'failed';
                state.cartError = action.payload;
            })
            .addCase(updateQuantityAsync.rejected, (state, action) => {
                state.cartStatus = 'failed';
                state.cartError = action.payload;
            })
            // Wishlist reducers
            .addCase(addToWishlistAsync.fulfilled, (state, action) => {
                state.wishlist.push(action.payload);
                state.wishlistStatus = 'succeeded';
            })
            .addCase(fetchWishlistAsync.fulfilled, (state, action) => {
                state.wishlist = action.payload;
                state.wishlistStatus = 'succeeded';
            })
            .addCase(removeFromWishlistAsync.fulfilled, (state, action) => {
                state.wishlist = state.wishlist.filter(i => i.id !== action.payload);
                state.wishlistStatus = 'succeeded';
            })
            .addCase(addToWishlistAsync.rejected, (state, action) => {
                state.wishlistStatus = 'failed';
                state.wishlistError = action.payload;
            })
            .addCase(fetchWishlistAsync.rejected, (state, action) => {
                state.wishlistStatus = 'failed';
                state.wishlistError = action.payload;
            })
            .addCase(removeFromWishlistAsync.rejected, (state, action) => {
                state.wishlistStatus = 'failed';
                state.wishlistError = action.payload;
            });
    }
});

export const { resetCart, resetWishlist } = userSlice.actions;
export default userSlice.reducer;