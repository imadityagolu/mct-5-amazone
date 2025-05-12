import React from "react"
import { FaSitemap, FaShoppingCart, FaBoxOpen, FaBars } from "react-icons/fa";

function Order() {
    return (
        <>
        <div className="text-white flex h-20 px-4 sm:px-10 items-center">
            <p className="font-bold text-black text-xl sm:text-xl flex gap-2">
                <FaBoxOpen className="text-3xl text-green-500"/>My Order !
            </p>
        </div>
        
        <div className="px-4 sm:px-10 mb-5 min-h-screen ">
            <p className="text-black text-md sm:text-xl">
            Your have ordered 0 items
            </p>
        </div>
        </>
    )
}

export default Order