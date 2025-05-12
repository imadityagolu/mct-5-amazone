import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doc, setDoc, getDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';

const initialState = {
    cart: [],
    total: 0,
    totalItems: 0,
    status: 'idle',
    error: null
};

// Async thunk to add item to Firestore
export const addToCartAsync = createAsyncThunk(
    'cart/addToCart',
    async (product, { rejectWithValue }) => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('User not authenticated');
            
            const cartRef = doc(db, `users/${user.uid}/cart`, String(product.id));
            const cartSnap = await getDoc(cartRef);
            
            if (cartSnap.exists()) {
                // Increment quantity if product exists
                const currentData = cartSnap.data();
                await setDoc(cartRef, {
                    ...currentData,
                    quantity: currentData.quantity + 1
                }, { merge: true });
                return { ...currentData, quantity: currentData.quantity + 1 };
            } else {
                // Add new product
                const newItem = { ...product, quantity: 1 };
                await setDoc(cartRef, newItem);
                return newItem;
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk to fetch cart from Firestore
export const fetchCartAsync = createAsyncThunk(
    'cart/fetchCart',
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

// Async thunk to remove item from Firestore
export const removeFromCartAsync = createAsyncThunk(
    'cart/removeFromCart',
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

// Async thunk to update quantity
export const updateQuantityAsync = createAsyncThunk(
    'cart/updateQuantity',
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

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        resetCart: (state) => {
            state.cart = [];
            state.total = 0;
            state.totalItems = 0;
        }
    },
    extraReducers: (builder) => {
        builder
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
                state.status = 'succeeded';
            })
            .addCase(fetchCartAsync.fulfilled, (state, action) => {
                state.cart = action.payload;
                state.total = state.cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
                state.totalItems = state.cart.reduce((sum, i) => sum + i.quantity, 0);
                state.status = 'succeeded';
            })
            .addCase(removeFromCartAsync.fulfilled, (state, action) => {
                state.cart = state.cart.filter(i => i.id !== action.payload);
                state.total = state.cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
                state.totalItems = state.cart.reduce((sum, i) => sum + i.quantity, 0);
                state.status = 'succeeded';
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
                state.status = 'succeeded';
            })
            .addCase(addToCartAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchCartAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(removeFromCartAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(updateQuantityAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;