import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSitemap, FaShoppingCart, FaBoxOpen, FaBars, FaHeart } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { IoPersonCircle } from "react-icons/io5";
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { getAuth } from "firebase/auth";
import app from '../../firebase';

const auth = getAuth(app);

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();
    const { cart } = useCart();

    const toggleSidebar = () => setIsOpen(!isOpen);

    function handleLogout() {
        auth.signOut();
        navigate("/");
    }

    // Shared links for both desktop and sidebar
    const navLinks = [
        {
            to: "/AllProducts",
            label: "All Products",
            icon: <FaSitemap />,
        },
        user && {
            to: "/Profile",
            label: "Profile",
            icon: <IoPersonCircle className="text-xl" />,
        },
        user && {
            to: "/Wishlist",
            label: "Wishlist",
            icon: <FaHeart />,
        },
        !user && {
            to: "/Login",
            label: "Login / Signup",
            icon: <IoPersonCircle className="text-xl" />,
        },
        user && {
            to: "/Cart",
            label: "Cart",
            icon: <FaShoppingCart />,
        },
        user && {
            to: "/Order",
            label: "Order",
            icon: <FaBoxOpen />,
        },
    ].filter(Boolean);

    return (
        <div className="bg-gray-900 text-white flex h-16 px-4 sm:px-10 justify-between items-center sticky top-0 z-40">
            {/* Logo */}
            <p className="font-bold text-2xl sm:text-3xl">
                <Link to="/">amazon.in</Link>
            </p>

            {/* Hamburger Icon */}
            <button
                className="md:hidden text-2xl focus:outline-none cursor-pointer"
                onClick={toggleSidebar}
                aria-label="Toggle menu"
            >
                <FaBars />
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
                {navLinks.map(({ to, label, icon }) => (
                    <div key={label} className="flex items-center gap-1">
                        {icon}
                        <Link to={to}>{label}</Link>
                    </div>
                ))}
                {user && (
                    <div className="flex items-center gap-1">
                        <button onClick={handleLogout} className="flex items-center gap-1">
                            <MdLogout title="Logout" />
                            <span className="text-red-500 cursor-pointer">Logout</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Sidebar for Small Screens */}
            <div
                className={`fixed top-0 right-0 h-full w-[50%] bg-gray-900 text-white flex flex-col pt-12 transform ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                } transition duration-300 ease-in-out md:hidden z-50`}
            >
                <div className="flex flex-col items-start gap-7 px-8">
                    {navLinks.map(({ to, label, icon }) => (
                        <div key={label} className="flex items-center gap-3">
                            {icon}
                            <Link to={to} onClick={toggleSidebar} className="text-xl">
                                {label}
                            </Link>
                        </div>
                    ))}
                    {user && (
                        <div className="flex items-center gap-3">
                            <button onClick={() => { handleLogout(); toggleSidebar(); }} className="flex items-center gap-2">
                                <MdLogout title="Logout" className="text-2xl" />
                                <span className="text-xl text-red-500 cursor-pointer">Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-opacity-50 md:hidden z-40"
                    onClick={toggleSidebar}
                    aria-hidden="true"
                ></div>
            )}
        </div>
    );
}

export default Navbar;
