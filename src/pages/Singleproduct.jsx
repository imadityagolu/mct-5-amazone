import React from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { addToCartAsync, addToWishlistAsync } from '../Slices/UserSlice';
import { toast } from 'react-hot-toast';
import { auth } from '../firebase';
import products from '../data/products.json';

function SingleProduct() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { cartStatus, cartError, wishlistStatus, wishlistError } = useSelector(state => state.user);
    const product = products.find(p => p.id === Number(id));

    const handleAddToCart = async () => {
        if (!auth.currentUser) {
            toast.error('Please log in to add items to cart');
            return;
        }

        try {
            await dispatch(addToCartAsync(product)).unwrap();
            toast.success(`${product.name} added to cart!`);
        } catch (error) {
            toast.error(`Failed to add to cart: ${error}`);
        }
    };

    const handleAddToWishlist = async () => {
        if (!auth.currentUser) {
            toast.error('Please log in to add items to wishlist');
            return;
        }

        try {
            await dispatch(addToWishlistAsync(product)).unwrap();
            toast.success(`${product.name} added to wishlist!`);
        } catch (error) {
            toast.error(`Failed to add to wishlist: ${error}`);
        }
    };

    if (!product) {
        return (
            <div className="w-full p-2 sm:p-4">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">Product Not Found</h2>
                <p className="text-sm text-gray-600">Sorry, the product you are looking for does not exist.</p>
                <Link to="/AllProducts" className="inline-block mt-2 text-sm sm:text-base text-blue-600 hover:underline">
                    Back to Products
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full p-5 sm:p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-[350px] h-[350px] object-contain rounded-lg mx-auto"
                    />
                </div>
                <div className="flex flex-col gap-2 mt-10">
                    <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">{product.name}</h2>
                    <p className="text-sm text-gray-600"><strong>Type:</strong> {product.type}</p>
                    <p className="text-sm text-gray-600"><strong>Description:</strong> {product.description}</p>
                    <p className="text-sm font-bold text-blue-600"><strong>Price:</strong> ₹{product.price}</p>
                    <div className="flex gap-2 w-[70%]">
                        <button
                            onClick={handleAddToCart}
                            disabled={cartStatus === 'loading'}
                            className="flex-1 bg-blue-600 text-white py-1 text-sm rounded-lg hover:bg-blue-700 focus:outline-none disabled:bg-blue-400"
                        >
                            {cartStatus === 'loading' ? 'Adding...' : 'Add to Cart'}
                        </button>
                        <button
                            onClick={handleAddToWishlist}
                            disabled={wishlistStatus === 'loading'}
                            className="flex-1 bg-gray-200 text-gray-800 py-1 text-sm rounded-lg hover:bg-gray-300 focus:outline-none disabled:bg-gray-100"
                        >
                            {wishlistStatus === 'loading' ? 'Adding...' : 'Add to Wishlist'}
                        </button>
                    </div>
                    <Link to="/AllProducts" className="text-sm sm:text-base text-blue-600 hover:underline">
                        Back to Products
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default SingleProduct;