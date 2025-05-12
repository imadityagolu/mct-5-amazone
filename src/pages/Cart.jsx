import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart } from 'react-icons/fa';
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

    // Load Razorpay checkout script dynamically
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

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

    const handlePayment = async () => {
        if (!window.Razorpay) {
            toast.error('Payment gateway failed to load. Please try again.');
            return;
        }

        if (!total || total <= 0) {
            toast.error('Cart total is invalid. Please check your cart.');
            return;
        }

        try {
            // Simulate backend API call to create a Razorpay order
            let order;
            try {
                const response = await fetch('/api/create-order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: total * 100, currency: 'INR', userId: user.uid }),
                });

                // Check if response is OK
                if (!response.ok) {
                    throw new Error(`Server responded with status: ${response.status}`);
                }

                // Check if response body is empty
                const text = await response.text();
                if (!text) {
                    throw new Error('Empty response from server');
                }

                // Parse JSON
                order = JSON.parse(text);
            } catch (fetchError) {
                console.error('Fetch error:', fetchError);
                // Fallback to simulated order if backend is not available
                order = {
                    id: 'order_' + Math.random().toString(36).substr(2, 9),
                    amount: total * 100, // Convert to paise
                    currency: 'INR',
                };
                console.warn('Using simulated order due to fetch error:', fetchError.message);
            }

            const options = {
                key: 'rzp_live_XQSSdVs9aUuJBO', // Replace with your Razorpay test key
                amount: order.amount,
                currency: order.currency,
                name: 'Your Store Name',
                description: 'Order Payment',
                order_id: order.id,
                handler: function (response) {
                    toast.success('Payment successful! Payment ID: ' + response.razorpay_payment_id);
                    // Optionally, dispatch an action to clear the cart or update order status
                },
                prefill: {
                    name: user.displayName || '',
                    email: user.email || '',
                    contact: user.phoneNumber || '',
                },
                theme: {
                    color: '#3B82F6', // Tailwind blue-500
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                toast.error('Payment failed: ' + response.error.description);
            });
            rzp.open();
        } catch (err) {
            console.error('Payment initiation error:', err);
            toast.error('Failed to initiate payment: ' + err.message);
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
                        <div className="pt-2">
                            <button
                                onClick={handlePayment}
                                className="border-l bg-blue-500 rounded-xl p-2 text-white w-full cursor-pointer hover:bg-blue-600"
                            >
                                Confirm Order
                            </button>
                        </div>
                        <Link
                            to="/AllProducts"
                            className="inline-block mt-2 text-sm sm:text-base text-blue-600 hover:underline"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                stoldiv>
            )}
        </div>
    );
}

export default Cart;
