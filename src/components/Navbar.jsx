import React from 'react';
import {
    auth,
    provider,
    signInWithGoogle,
    signOutFn,
    onAuthStateChanged,
} from "../utils/Firebase";
import { useNavigate } from 'react-router-dom';

const Navbar = () => {

    const navigate = useNavigate();
    return (
        <nav className="border-b border-gray-300 py-4 w-full fixed h-16 flex items-center z-10">
            <div className="px-4 flex justify-between items-center w-full">
                <div className="text-gray-700 text-3xl font-serif px-2 cursor-pointer hover:text-black"
                >
                    Artyfycial
                </div>
                <div className="flex">
                    <a href="#" className="text-gray-700 hover:text-gray-400 px-2 transition-all duration-300">About</a>
                    <a href="#" className="text-gray-700 hover:text-gray-400 px-2 transition-all duration-300">Services</a>
                    <a href="#" className="text-gray-700 hover:text-gray-400 px-2 transition-all duration-300" onClick={signOutFn}>Sign Out</a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
