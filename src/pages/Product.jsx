import React from "react";
import { trimContent } from "../pages/trimContent";

function Product({ product }) {
  if (!product || !product.asin) {
    return (
      <div className="text-center text-gray-600 p-5">
        Product not found
      </div>
    );
  }

  const {
    asin,
    product_title = "No title available",
    product_price = "Price not available",
    product_photo = "https://via.placeholder.com/150",
    product_availability = "Availability not specified",
    product_star_rating = 0,
    product_num_ratings = 0,
  } = product;

  return (
    <div className="bg-white rounded-lg shadow-lg p-3">
      <img
        src={product_photo}
        alt={product_title}
        className="w-full h-70 sm:h-70 object-cover rounded-t-lg"
      />
      <div className="p-2 sm:p-3">
        <h3 className="text-sm sm:text-base font-semibold text-gray-800">
          Product no: {asin}
        </h3>
        <p className="text-gray-600 mb-2">{trimContent(product_title, 5)}</p>
        <p className="text-sm sm:text-base font-bold text-blue-600 mt-2">
          {product_price}
        </p>
        <p>{product_availability}</p>
        <div className="flex items-center mb-2">
          <span className="text-yellow-400">
            {"★".repeat(Math.round(product_star_rating))}
          </span>
          <span className="text-gray-500 ml-2">
            ({product_num_ratings} reviews)
          </span>
        </div>
        <div className="mt-2 flex gap-2">
          <button className="flex-1 bg-blue-600 text-white py-1 text-xs sm:text-sm rounded-lg hover:bg-blue-700 focus:outline-none">
            Add to Cart
          </button>
          <button className="flex-1 bg-gray-200 text-gray-800 py-1 text-xs sm:text-sm rounded-lg hover:bg-gray-300 focus:outline-none">
            Add to Wishlist
          </button>
        </div>
      </div>
    </div>
  );
}

export default Product;