import React, { useRef, useEffect, useState } from "react";
import Banner from '../images/banner.png';
import { Link } from "react-router-dom";
import AllProducts from "./AllProducts";
import products from '../data/products.json';

function Home() {
    // Refs and state for Featured Products carousel
    const carouselRef = useRef(null);
    const prevBtnRef = useRef(null);
    const nextBtnRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Refs and state for Electronics carousel
    const electronicsCarouselRef = useRef(null);
    const electronicsPrevBtnRef = useRef(null);
    const electronicsNextBtnRef = useRef(null);
    const [electronicsCurrentIndex, setElectronicsCurrentIndex] = useState(0);

    // State for screen size
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 640);

    // Shared logic for both carousels
    const getVisibleItems = () => {
        if (window.innerWidth < 640) return 1; // Mobile: 1 item
        if (window.innerWidth < 768) return 2; // Small tablet: 2 items
        return 4; // Desktop: 4 items
    };

    // Update function for Featured Products carousel
    const updateCarousel = () => {
        if (carouselRef.current) {
            const visibleItems = getVisibleItems();
            const offset = -currentIndex * (100 / visibleItems);
            carouselRef.current.style.transform = `translateX(${offset}%)`;
        }
    };

    // Update function for Electronics carousel
    const updateElectronicsCarousel = () => {
        if (electronicsCarouselRef.current) {
            const visibleItems = getVisibleItems();
            const offset = -electronicsCurrentIndex * (100 / visibleItems);
            electronicsCarouselRef.current.style.transform = `translateX(${offset}%)`;
        }
    };

    // Effect for screen size detection
    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 640);
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Effect for Featured Products carousel
    useEffect(() => {
        const handleNext = () => {
            if (carouselRef.current) {
                const totalItems = carouselRef.current.children.length;
                const visibleItems = getVisibleItems();
                if (currentIndex < totalItems - visibleItems) {
                    setCurrentIndex(currentIndex + 1);
                }
            }
        };

        const handlePrev = () => {
            if (currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
            }
        };

        const handleResize = () => {
            setCurrentIndex(0); // Reset to first item on resize
            updateCarousel();
        };

        // Add event listeners
        const nextBtn = nextBtnRef.current;
        const prevBtn = prevBtnRef.current;
        if (nextBtn) {
            nextBtn.addEventListener('click', handleNext);
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', handlePrev);
        }
        window.addEventListener('resize', handleResize);

        // Initial update
        updateCarousel();

        // Cleanup event listeners on unmount
        return () => {
            if (nextBtn) {
                nextBtn.removeEventListener('click', handleNext);
            }
            if (prevBtn) {
                prevBtn.removeEventListener('click', handlePrev);
            }
            window.removeEventListener('resize', handleResize);
        };
    }, [currentIndex]);

    // Effect for Electronics carousel
    useEffect(() => {
        const handleNext = () => {
            if (electronicsCarouselRef.current) {
                const totalItems = electronicsCarouselRef.current.children.length;
                const visibleItems = getVisibleItems();
                if (electronicsCurrentIndex < totalItems - visibleItems) {
                    setElectronicsCurrentIndex(electronicsCurrentIndex + 1);
                }
            }
        };

        const handlePrev = () => {
            if (electronicsCurrentIndex > 0) {
                setElectronicsCurrentIndex(electronicsCurrentIndex - 1);
            }
        };

        const handleResize = () => {
            setElectronicsCurrentIndex(0); // Reset to first item on resize
            updateElectronicsCarousel();
        };

        // Add event listeners
        const nextBtn = electronicsNextBtnRef.current;
        const prevBtn = electronicsPrevBtnRef.current;
        if (nextBtn) {
            nextBtn.addEventListener('click', handleNext);
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', handlePrev);
        }
        window.addEventListener('resize', handleResize);

        // Initial update
        updateElectronicsCarousel();

        // Cleanup event listeners on unmount
        return () => {
            if (nextBtn) {
                nextBtn.removeEventListener('click', handleNext);
            }
            if (prevBtn) {
                prevBtn.removeEventListener('click', handlePrev);
            }
            window.removeEventListener('resize', handleResize);
        };
    }, [electronicsCurrentIndex]);

    // Reusable product card function
    const productCard = (product) => (
        <div className="w-[300px] h-fit p-2">
            <div className="bg-white rounded-lg shadow-lg p-2">
                <Link to={`/product/${product.id}`}>
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-[200px] object-contain rounded-t-lg"
                />
                <div className="p-2">
                    <h3 className="text-xs font-semibold text-gray-800">{product.name}</h3>
                    <p className="text-[10px] text-gray-600 mt-1 line-clamp-2">{product.description}</p>
                    <p className="text-sm font-bold text-blue-600 mt-1">₹{product.price}</p>
                    <div className="mt-1 flex gap-1">
                        <button className="flex-1 bg-blue-600 text-white py-0.5 text-xs rounded-lg hover:bg-blue-700 focus:outline-none cursor-pointer">
                            Look for the product
                        </button>
                    </div>
                </div>
                </Link>
            </div>
        </div>
    );

    // Filter products by type and screen size
    const featuredProductsList = products.filter(product => product.type === "featured");
    const electronicsProductsList = products.filter(product => product.type === "electronic");

    return (
        <>
            {/* banner */}
            <div className="w-full px-[2%] sm:px-[5%] py-1 sm:py-2 flex items-center justify-center">
                <img src={Banner} alt="banner" className="rounded-xl max-w-full h-auto" />
            </div>

            {/* featured products */}
            <div className="w-full p-2 sm:p-4">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2"><b className="text-red-500 text-4xl">F</b>eatured Products</h2>
                <div className="relative">
                    <div className="overflow-hidden">
                        <div className="flex transition-transform duration-300 ease-in-out" id="carousel" ref={carouselRef}>
                            {featuredProductsList.map((product) => (
                                <div key={product.id}>{productCard(product)}</div>
                            ))}
                        </div>
                    </div>
                    <button ref={prevBtnRef} id="prevBtn" className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-1 sm:p-2 rounded-full hover:bg-blue-700 focus:outline-none">
                        ←
                    </button>
                    <button ref={nextBtnRef} id="nextBtn" className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-1 sm:p-2 rounded-full hover:bg-blue-700 focus:outline-none">
                        →
                    </button>
                </div>
            </div>

            {/* electronics */}
            <div className="w-full p-2 sm:p-4">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2"><b className="text-red-500 text-4xl">E</b>lectronics</h2>
                <div className="relative">
                    <div className="overflow-hidden">
                        <div className="flex transition-transform duration-300 ease-in-out" id="carousel" ref={electronicsCarouselRef}>
                            {electronicsProductsList.map((product) => (
                                <div key={product.id}>{productCard(product)}</div>
                            ))}
                        </div>
                    </div>
                    <button ref={electronicsPrevBtnRef} id="prevBtn" className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-1 sm:p-2 rounded-full hover:bg-blue-700 focus:outline-none">
                        ←
                    </button>
                    <button ref={electronicsNextBtnRef} id="nextBtn" className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-1 sm:p-2 rounded-full hover:bg-blue-700 focus:outline-none">
                        →
                    </button>
                </div>
            </div>

            {/* show all button */}
            <div className="w-full p-2 sm:p-3 mb-4 sm:mb-5">
                <div className="rounded-lg bg-gray-200 text-center shadow-xl p-1 sm:p-2 cursor-pointer">
                    <Link to="/AllProducts" className="text-sm sm:text-base">Show All Products</Link>
                </div>
            </div>
        </>
    );
}

export default Home;