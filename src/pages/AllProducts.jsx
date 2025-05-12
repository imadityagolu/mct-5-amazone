import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import products from '../data/products.json';

function AllProducts() {
    // State for screen size
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 640);
    // State for search and filters
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [priceFilter, setPriceFilter] = useState("");
    const [sortOption, setSortOption] = useState("relevance");
    const [filteredProducts, setFilteredProducts] = useState(products);

    // Effect for screen size detection
    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 640);
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Effect for filtering and sorting products
    useEffect(() => {
        let result = [...products];

        // Apply search filter (name and type)
        if (searchQuery) {
            result = result.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.type.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply category filter
        if (categoryFilter) {
            result = result.filter(product => product.type === categoryFilter);
        }

        // Apply price filter
        if (priceFilter) {
            if (priceFilter === "0-5000") {
                result = result.filter(product => product.price >= 0 && product.price <= 5000);
            } else if (priceFilter === "5001-10000") {
                result = result.filter(product => product.price >= 5001 && product.price <= 10000);
            } else if (priceFilter === "10001+") {
                result = result.filter(product => product.price >= 10001);
            }
        }

        // Apply sorting
        if (sortOption === "price-low") {
            result.sort((a, b) => a.price - b.price);
        } else if (sortOption === "price-high") {
            result.sort((a, b) => b.price - a.price);
        } else if (sortOption === "name") {
            result.sort((a, b) => a.name.localeCompare(b.name));
        }
        // For "relevance", use default order (no sorting)

        setFilteredProducts(result);
    }, [searchQuery, categoryFilter, priceFilter, sortOption]);

    // Reusable product card function
    const productCard = (product) => (
        <div className="w-[300px] h-fit p-2 mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-2">
                <Link to={`/product/${product.id}`}>
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-[200px] object-contain rounded-t-lg"
                    />
                    <div className="p-2">
                        <h3 className="text-xs font-semibold text-gray-800">{product.name}</h3>
                        <p className="text-[10px] text-gray-600 mt-1 line-clamp-2">{product.type} : {product.description}</p>
                        <p className="text-sm font-bold text-blue-600 mt-1">₹{product.price}</p>
                    </div>
                </Link>
                <div className="p-2 pt-0 flex gap-1">
                    <button className="flex-1 bg-blue-600 text-white py-0.5 text-xs rounded-lg hover:bg-blue-700 focus:outline-none">
                        Look for the product
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* search bar */}
            <div className="w-full px-2 sm:px-3 py-1 sm:py-2 bg-white rounded-lg shadow-lg">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-1 sm:p-2 pl-8 sm:pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    />
                    <svg className="absolute left-2 sm:left-3 top-2 sm:top-3 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                </div>
            </div>

            {/* filter controls */}
            <div className="w-full px-5 py-3 bg-white rounded-lg shadow-lg">
                <div className="flex flex-wrap gap-4 mb-3">
                    <div className="flex-1 min-w-[150px]">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                            id="category"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All</option>
                            <option value="featured">Featured</option>
                            <option value="electronic">Electronics</option>
                        </select>
                    </div>
                    <div className="flex-1 min-w-[150px]">
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price Range</label>
                        <select
                            id="price"
                            value={priceFilter}
                            onChange={(e) => setPriceFilter(e.target.value)}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All</option>
                            <option value="0-5000">₹0 - ₹5000</option>
                            <option value="5001-10000">₹5001 - ₹10000</option>
                            <option value="10001+">₹10001+</option>
                        </select>
                    </div>
                    <div className="flex-1 min-w-[150px]">
                        <label htmlFor="sort" className="block text-sm font-medium text-gray-700">Sort By</label>
                        <select
                            id="sort"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="relevance">Relevance</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="name">Name</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* all products */}
            <div className="w-full p-2 sm:p-4">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2"><b className="text-red-500 text-4xl">A</b>ll Products</h2>
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {filteredProducts.map((product) => (
                            <div key={product.id}>{productCard(product)}</div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-600">No products found.</p>
                )}
            </div>
        </>
    );
}

export default AllProducts;