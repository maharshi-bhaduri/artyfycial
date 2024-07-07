import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PopupMenu = ({ options }) => {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setMenuOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setMenuOpen(!isMenuOpen)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
            >
                Manage
            </button>
            {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-md border border-gray-300 rounded-md z-20">
                    {options.map((option, index) => (
                        <Link
                            key={index}
                            to={option.path}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                            {option.option}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PopupMenu;
