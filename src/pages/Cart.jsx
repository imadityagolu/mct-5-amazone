import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaSitemap, FaShoppingCart, FaBoxOpen, FaBars } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { fetchCartAsync, removeFromCartAsync, updateQuantityAsync } from '../Slices/CartSlice';
import { auth } from '../firebase';

function Cart() {
    const dispatch = useDispatch();
    const { cart, total, totalItems, status, error } = useSelector(state => state.cart);
    const user = auth.currentUser;

    useEffect(() => {
        if (user) {
            dispatch(fetchCartAsync());
        }
    }, [dispatch, user]);

    const handleRemove = async (productId) => {
        try {
            await dispatch(removeFromCartAsync(productId)).unwrap();
            toast.success('Item removed from cart');
        } catch (err) {
            toast.error(`Failed to remove item: ${err}`);
        }
    };

    const handleQuantityChange = async (productId, newQuantity) => {
        try {
            await dispatch(updateQuantityAsync({ productId, quantity: newQuantity })).unwrap();
            toast.success('Quantity updated');
        } catch (err) {
            toast.error(`Failed to update quantity: ${err}`);
        }
    };

    if (!user) {
        return (
            <div className="w-full p-2 sm:p-4">
            <p className="font-bold text-black text-xl sm:text-xl flex gap-2 p-3">
            <FaShoppingCart className="text-3xl text-yellow-500"/>My Cart !
            </p>
                <p className="text-sm text-gray-600">Please log in to view your cart.</p>
                <Link to="/AllProducts" className="inline-block mt-2 text-sm sm:text-base text-blue-600 hover:underline">
                    Back to Products
                </Link>
            </div>
        );
    }

    if (status === 'loading') {
        return (
            <div className="w-full p-2 sm:p-4">
            <p className="font-bold text-black text-xl sm:text-xl flex gap-2 p-3">
            <FaShoppingCart className="text-3xl text-yellow-500"/>My Cart !
            </p>
                <p className="text-sm text-gray-600">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full p-2 sm:p-4">
            <p className="font-bold text-black text-xl sm:text-xl flex gap-2 p-3">
            <FaShoppingCart className="text-3xl text-yellow-500"/>My Cart !
            </p>
                <p className="text-sm text-gray-600">Error: {error}</p>
                <Link to="/AllProducts" className="inline-block mt-2 text-sm sm:text-base text-blue-600 hover:underline">
                    Back to Products
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full p-2 sm:p-4">
            <p className="font-bold text-black text-xl sm:text-xl flex gap-2 p-3">
            <FaShoppingCart className="text-3xl text-yellow-500"/>My Cart !
            </p>
            {cart.length === 0 ? (
                <div>
                    <p className="text-sm text-gray-600">Your cart is empty.</p>
                    <Link to="/AllProducts" className="inline-block mt-2 text-sm sm:text-base text-blue-600 hover:underline">
                        Shop Now
                    </Link>
                </div>
            ) : (
                <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {cart.map(item => (
                            <div key={item.id} className="w-[300px] h-fit p-2 mx-auto">
                                <div className="bg-white rounded-xl shadow-2xl border-1 p-2">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-[150px] h-[150px] object-contain rounded-t-lg mx-auto"
                                    />
                                    <div className="p-2">
                                        <h3 className="text-xs font-semibold text-gray-800">{item.name}</h3>
                                        <p className="text-[10px] text-gray-600 mt-1">{item.type}</p>
                                        <p className="text-sm font-bold text-blue-600 mt-1">₹{item.price}</p>
                                        <div className="flex items-center mt-1">
                                            <button
                                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                className="p-1 bg-gray-200 rounded-full hover:bg-gray-300"
                                            >
                                                <FaMinus size={12} />
                                            </button>
                                            <span className="mx-2 text-sm">{item.quantity}</span>
                                            <button
                                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                className="p-1 bg-gray-200 rounded-full hover:bg-gray-300"
                                            >
                                                <FaPlus size={12} />
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemove(item.id)}
                                        className="w-full bg-red-600 text-white py-1 text-xs rounded-lg hover:bg-red-700 cursor-pointer"
                                    >
                                        <FaTrash className="inline mr-1" /> Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 p-4 bg-white rounded-lg shadow-lg">
                        <p className="text-sm font-bold">Total Items: {totalItems}</p>
                        <p className="text-sm font-bold">Total Price: ₹{total}</p>
                        <div className='pt-2 '>
                        <button className='border-l bg-blue-500 rounded-xl p-2 text-white w-full cursor-pointer'>Confirm Order</button>
                        </div>
                        <Link
                            to="/AllProducts"
                            className="inline-block mt-2 text-sm sm:text-base text-blue-600 hover:underline"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;