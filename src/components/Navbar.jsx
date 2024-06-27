import React, { useState, useEffect } from 'react';
import {
    auth,
    provider,
    signInWithGoogle,
    signOutFn,
    onAuthStateChanged,
} from "../utils/Firebase";
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSignedIn, setIsSignedIn] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsSignedIn(!!user);
        });

        return () => unsubscribe();
    }, []);

    const handleNavigation = () => {
        if (location.pathname === '/discover') {
            navigate('/create');
        } else if (location.pathname === '/create') {
            navigate('/discover');
        }
    };

    return (
        <nav className="border-b border-gray-300 py-4 w-full fixed h-12 flex items-center z-10">
            <div className="px-4 flex justify-between items-center w-full">
                <div className="text-gray-700 text-3xl font-serif px-2 cursor-pointer hover:text-black">
                    Artyfycial
                </div>
                <div className="flex">
                    <a
                        href="#"
                        className="text-gray-700 hover:text-gray-400 px-2 transition-all duration-300"
                        onClick={handleNavigation}
                    >
                        {location.pathname === '/discover' ? 'Create' : 'Discover'}
                    </a>
                    <a href="#" className="text-gray-700 hover:text-gray-400 px-2 transition-all duration-300">Services</a>
                    {isSignedIn ? (
                        <a
                            href="#"
                            className="text-gray-700 hover:text-gray-400 px-2 transition-all duration-300"
                            onClick={signOutFn}
                        >
                            Sign Out
                        </a>
                    ) : (
                        <a
                            href="#"
                            className="text-gray-700 hover:text-gray-400 px-2 transition-all duration-300"
                            onClick={signInWithGoogle}
                        >
                            Sign In
                        </a>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
