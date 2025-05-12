import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaSitemap, FaShoppingCart, FaBoxOpen, FaBars } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { fetchWishlistAsync, removeFromWishlistAsync } from '../Slices/UserSlice';
import { auth } from '../firebase';

function Wishlist() {
    const dispatch = useDispatch();
    const { wishlist, wishlistStatus, wishlistError } = useSelector(state => state.user);
    const user = auth.currentUser;

    useEffect(() => {
        if (user) {
            dispatch(fetchWishlistAsync());
        }
    }, [dispatch, user]);

    const handleRemove = async (productId) => {
        try {
            await dispatch(removeFromWishlistAsync(productId)).unwrap();
            toast.success('Item removed from wishlist');
        } catch (err) {
            toast.error(`Failed to remove item: ${err}`);
        }
    };

    if (!user) {
        return (
            <div className="w-full p-2 sm:p-4">
            <p className="font-bold text-black text-xl sm:text-xl flex gap-2 p-3">
            <FaShoppingCart className="text-3xl text-red-500"/>My Wishlist !
            </p>
                <p className="text-sm text-gray-600">Please log in to view your wishlist.</p>
                <Link to="/AllProducts" className="inline-block mt-2 text-sm sm:text-base text-blue-600 hover:underline">
                    Back to Products
                </Link>
            </div>
        );
    }

    if (wishlistStatus === 'loading') {
        return (
            <div className="w-full p-2 sm:p-4">
            <p className="font-bold text-black text-xl sm:text-xl flex gap-2 p-3">
            <FaShoppingCart className="text-3xl text-red-500"/>My Wishlist !
            </p>
                <p className="text-sm text-gray-600">Loading...</p>
            </div>
        );
    }

    if (wishlistError) {
        return (
            <div className="w-full p-2 sm:p-4">
            <p className="font-bold text-black text-xl sm:text-xl flex gap-2 p-3">
            <FaShoppingCart className="text-3xl text-red-500"/>My Wishlist !
            </p>
                <p className="text-sm text-gray-600">Error: {wishlistError}</p>
                <Link to="/AllProducts" className="inline-block mt-2 text-sm sm:text-base text-blue-600 hover:underline">
                    Back to Products
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full p-2 sm:p-4">
            <p className="font-bold text-black text-xl sm:text-xl flex gap-2 p-3">
            <FaShoppingCart className="text-3xl text-red-500"/>My Wishlist !
            </p>
            {wishlist.length === 0 ? (
                <div>
                    <p className="text-sm text-gray-600">Your wishlist is empty.</p>
                    <Link to="/AllProducts" className="inline-block mt-2 text-sm sm:text-base text-blue-600 hover:underline">
                        Shop Now
                    </Link>
                </div>
            ) : (
                <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {wishlist.map(item => (
                            <div key={item.id} className="w-[300px] h-fit p-2 mx-auto">
                                <div className="bg-white rounded-xl shadow-2xl border-1 p-2">
                                    <Link to={`/product/${item.id}`}>
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-[150px] h-[150px] object-contain rounded-t-lg mx-auto"
                                    />
                                    <div className="p-2">
                                        <h3 className="text-xs font-semibold text-gray-800">{item.name}</h3>
                                        <p className="text-[10px] text-gray-600 mt-1">{item.type} : {item.description}</p>
                                        <p className="text-sm font-bold text-blue-600 mt-1">₹{item.price}</p>
                                    </div>
                                    <button
                                        onClick={() => handleRemove(item.id)}
                                        className="w-full bg-red-600 text-white py-1 text-xs rounded-lg hover:bg-red-700 cursor-pointer"
                                    >
                                        <FaTrash className="inline mr-1" /> Remove
                                    </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 p-4 bg-white rounded-lg shadow-lg">
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

export default Wishlist;