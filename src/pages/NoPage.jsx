import React from "react"
import { FaSitemap, FaShoppingCart, FaBoxOpen, FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";

function NoPage() {
    return (
        <div className="bg-gray-200 text-white min-h-screen flex items-center justify-center">
            
            <p className="font-bold text-black text-xl sm:text-xl flex gap-2">
                Error 404 : Page not found go to&nbsp;
            </p>
            
            <h1><Link to="/" className="text-blue-500 underline">home page !</Link></h1>

        </div>
    )
}

export default NoPage